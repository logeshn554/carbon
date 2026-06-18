import { describe, it, expect } from 'vitest';
import { calculateScore, getScoreLabel, compareToAverages, BENCHMARKS } from '../../services/scoringService.js';

describe('Scoring Service', () => {
  describe('calculateScore', () => {
    it('returns 100 for zero emissions', () => {
      expect(calculateScore(0)).toBe(100);
    });

    it('returns 100 for emissions at or below Paris target', () => {
      expect(calculateScore(2000)).toBe(100);
      expect(calculateScore(1000)).toBe(100);
      expect(calculateScore(0)).toBe(100);
    });

    it('returns score in 90-100 range for excellent emissions', () => {
      const score = calculateScore(2500);
      expect(score).toBeGreaterThanOrEqual(90);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('returns score in 70-89 range for good emissions', () => {
      const score = calculateScore(4000);
      expect(score).toBeGreaterThanOrEqual(70);
      expect(score).toBeLessThan(90);
    });

    it('returns score in 50-69 range for moderate emissions', () => {
      const score = calculateScore(6000);
      expect(score).toBeGreaterThanOrEqual(50);
      expect(score).toBeLessThan(70);
    });

    it('returns score below 50 for high emissions', () => {
      const score = calculateScore(9000);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThan(50);
    });

    it('returns 0 for emissions at or above 12000 kg', () => {
      expect(calculateScore(12000)).toBe(0);
      expect(calculateScore(15000)).toBe(0);
    });

    it('score decreases monotonically with increasing emissions', () => {
      const scores = [1000, 2500, 4000, 6000, 9000, 12000].map(calculateScore);
      for (let i = 1; i < scores.length; i++) {
        expect(scores[i]).toBeLessThanOrEqual(scores[i - 1]);
      }
    });

    it('handles negative emissions gracefully', () => {
      expect(calculateScore(-100)).toBe(100);
    });
  });

  describe('getScoreLabel', () => {
    it('returns Excellent for score >= 90', () => {
      expect(getScoreLabel(95).label).toBe('Excellent');
      expect(getScoreLabel(90).label).toBe('Excellent');
    });

    it('returns Good for score 70-89', () => {
      expect(getScoreLabel(80).label).toBe('Good');
      expect(getScoreLabel(70).label).toBe('Good');
    });

    it('returns Moderate for score 50-69', () => {
      expect(getScoreLabel(60).label).toBe('Moderate');
      expect(getScoreLabel(50).label).toBe('Moderate');
    });

    it('returns Needs Improvement for score < 50', () => {
      expect(getScoreLabel(49).label).toBe('Needs Improvement');
      expect(getScoreLabel(0).label).toBe('Needs Improvement');
    });

    it('returns color for each label', () => {
      [100, 80, 60, 30].forEach((score) => {
        const info = getScoreLabel(score);
        expect(info.color).toBeTruthy();
        expect(info.tier).toBeTruthy();
        expect(info.description).toBeTruthy();
      });
    });
  });

  describe('compareToAverages', () => {
    it('returns comparison object with correct keys', () => {
      const result = compareToAverages(4700);
      expect(result).toHaveProperty('vsGlobalAverage');
      expect(result).toHaveProperty('vsUkAverage');
      expect(result).toHaveProperty('vsParisTarget');
      expect(result).toHaveProperty('globalAverage');
      expect(result).toHaveProperty('ukAverage');
      expect(result).toHaveProperty('parisTarget');
    });

    it('returns 0% vs global average for global average emission', () => {
      const result = compareToAverages(4700);
      expect(result.vsGlobalAverage).toBeCloseTo(0, 0);
    });

    it('returns negative percentage for below-average emission', () => {
      const result = compareToAverages(2000);
      expect(result.vsGlobalAverage).toBeLessThan(0);
    });

    it('returns positive percentage for above-average emission', () => {
      const result = compareToAverages(8000);
      expect(result.vsGlobalAverage).toBeGreaterThan(0);
    });
  });

  // ── Boundary Tests ────────────────────────────────────────────────────────────
  describe('Boundary Values', () => {
    it('score at exactly Paris target (2000 kg) is 100', () => {
      expect(calculateScore(2000)).toBe(100);
    });

    it('score at exactly excellent threshold (3000 kg) is 90', () => {
      expect(calculateScore(3000)).toBe(90);
    });

    it('score at exactly good threshold (5000 kg) is 70', () => {
      expect(calculateScore(5000)).toBe(70);
    });

    it('score at exactly moderate threshold (7500 kg) is 50', () => {
      expect(calculateScore(7500)).toBe(50);
    });

    it('score at exactly poor threshold (12000 kg) is 0', () => {
      expect(calculateScore(12000)).toBe(0);
    });

    it('score for 0 emissions is 100', () => {
      expect(calculateScore(0)).toBe(100);
    });

    it('score for negative emissions is 100', () => {
      expect(calculateScore(-500)).toBe(100);
    });

    it('score is always between 0 and 100', () => {
      [0, 1000, 2000, 3000, 5000, 7500, 10000, 12000, 20000].forEach((kg) => {
        const score = calculateScore(kg);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });
});
