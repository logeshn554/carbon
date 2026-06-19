/**
 * Assessment Service
 *
 * Encapsulates all business logic for creating carbon footprint assessments:
 * emission calculation, sustainability scoring, recommendation generation,
 * and persistence inside a Prisma transaction.
 *
 * The controller stays as a thin HTTP adapter — it only validates HTTP input,
 * calls this service, and maps the result to an HTTP response.
 */

import prisma from '../utils/prismaClient.js';
import { calculateAllEmissions } from './carbonCalculator.js';
import { calculateScore } from './scoringService.js';
import { generateRecommendations } from './recommendationEngine.js';

/**
 * Create a new assessment with full emission analysis and recommendations.
 *
 * The function performs:
 *  1. Auto-upsert the user record (handles stale/unknown UUIDs gracefully).
 *  2. Calculate per-category and total emissions via carbonCalculator.
 *  3. Derive a 0-100 sustainability score via scoringService.
 *  4. Run the deterministic rules engine to produce prioritised recommendations.
 *  5. Persist assessment + recommendations in a single Prisma transaction.
 *
 * @param {Object} data - Validated assessment input (matches assessmentSchema).
 * @returns {Promise<{assessment: Object, emissions: Object, score: number}>}
 */
export async function createAssessmentWithRecommendations(data) {
  // ── Step 1: Resolve user ───────────────────────────────────────────────────
  // Auto-upsert user — if frontend registration failed or DB was wiped,
  // create the user on the fly so the assessment never fails with "User not found".
  let user = await prisma.user.findUnique({ where: { id: data.userId } });

  // effectiveUserId avoids mutating the Zod-parsed `data` object.
  let effectiveUserId = data.userId;

  if (!user) {
    // NOTE: The email pattern `${id}@ecoguide.ai` is a synthetic, non-PII
    // placeholder used only as a unique key for anonymous user upsert.
    // It is never displayed to end users nor sent in any communications.
    user = await prisma.user.upsert({
      where: { email: `${data.userId}@ecoguide.ai` },
      update: {},
      create: {
        name: 'Anonymous',
        email: `${data.userId}@ecoguide.ai`,
      },
    });
    // Use the actual DB-assigned id for this assessment
    effectiveUserId = user.id;
  }

  // ── Step 2: Calculate emissions ────────────────────────────────────────────
  const emissions = calculateAllEmissions(data);

  // ── Step 3: Score ──────────────────────────────────────────────────────────
  const score = calculateScore(emissions.totalEmission);

  // ── Step 4: Generate personalised recommendations ──────────────────────────
  // The rules engine makes logical decisions based on the user's specific
  // context. For example: if dailyCarKm > 10 AND carFuelType === 'petrol',
  // the engine fires the "Switch to EV" rule and computes exact kg savings:
  //   savings = round((dailyCarKm × petrolFactor − dailyCarKm × evFactor) × 365)
  // This deterministic branching is applied across all four lifestyle domains
  // (transport, energy, food, shopping), ensuring each recommendation is
  // grounded in the user's actual input values — not generic advice.
  const recs = generateRecommendations(data, emissions);

  // ── Step 5: Persist ────────────────────────────────────────────────────────
  // All Prisma queries use parameterized inputs via the ORM — no raw SQL
  // interpolation, preventing SQL injection by design.
  const assessment = await prisma.$transaction(async (tx) => {
    const created = await tx.assessment.create({
      data: {
        userId: effectiveUserId,
        dailyCarKm: data.dailyCarKm,
        carFuelType: data.carFuelType,
        publicTransportKmPerWeek: data.publicTransportKmPerWeek,
        cyclingKmPerWeek: data.cyclingKmPerWeek,
        shortFlightsPerYear: data.shortFlightsPerYear,
        longFlightsPerYear: data.longFlightsPerYear,
        monthlyElectricityKwh: data.monthlyElectricityKwh,
        renewablePercentage: data.renewablePercentage,
        dietType: data.dietType,
        clothingItemsPerYear: data.clothingItemsPerYear,
        electronicsItemsPerYear: data.electronicsItemsPerYear,
        transportEmission: emissions.transportEmission,
        energyEmission: emissions.energyEmission,
        foodEmission: emissions.foodEmission,
        shoppingEmission: emissions.shoppingEmission,
        totalEmission: emissions.totalEmission,
        sustainabilityScore: score,
        recommendations: {
          create: recs.map((r) => ({
            title: r.title,
            description: r.description,
            estimatedSavings: r.estimatedSavings,
            priority: r.priority,
            category: r.category,
          })),
        },
      },
      include: {
        recommendations: { orderBy: { estimatedSavings: 'desc' } },
      },
    });
    return created;
  });

  return { assessment, emissions, score };
}
