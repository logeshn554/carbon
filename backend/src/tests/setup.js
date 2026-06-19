import { vi, beforeEach } from 'vitest';

// Stateful in-memory database simulation for testing
const db = {
  users: [],
  assessments: [],
  recommendations: [],
  simulations: [],
};

let idCounter = 1;
const nextId = (prefix) => `${prefix}_${idCounter++}`;

const mockPrisma = {
  $transaction: async (fn) => fn(mockPrisma),
  $disconnect: async () => {},
  user: {
    findUnique: async ({ where, include }) => {
      const u = db.users.find((user) => user.id === where.id || user.email === where.email);
      if (!u) return null;
      const res = { ...u };
      if (include?._count?.select?.assessments) {
        res._count = {
          assessments: db.assessments.filter((a) => a.userId === u.id).length,
        };
      }
      return res;
    },
    create: async ({ data, include }) => {
      const u = {
        id: data.id || nextId('user'),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      db.users.push(u);
      const res = { ...u };
      if (include?._count?.select?.assessments) {
        res._count = { assessments: 0 };
      }
      return res;
    },
    upsert: async ({ where, create, update, include }) => {
      let u = db.users.find((user) => user.id === where.id || user.email === where.email);
      if (u) {
        Object.assign(u, update);
      } else {
        u = {
          id: create.id || nextId('user'),
          createdAt: new Date(),
          updatedAt: new Date(),
          ...create,
        };
        db.users.push(u);
      }
      const res = { ...u };
      if (include?._count?.select?.assessments) {
        res._count = {
          assessments: db.assessments.filter((a) => a.userId === u.id).length,
        };
      }
      return res;
    },
    delete: async ({ where }) => {
      const idx = db.users.findIndex((user) => user.id === where.id);
      if (idx !== -1) {
        db.users.splice(idx, 1);
      }
      return {};
    },
  },
  assessment: {
    findUnique: async ({ where, include }) => {
      const a = db.assessments.find((assess) => assess.id === where.id);
      if (!a) return null;
      const res = { ...a };
      if (include?.recommendations) {
        res.recommendations = db.recommendations.filter((r) => r.assessmentId === a.id);
      }
      if (include?.simulations) {
        res.simulations = db.simulations.filter((s) => s.assessmentId === a.id);
      }
      if (include?.user) {
        res.user = db.users.find((user) => user.id === a.userId);
      }
      return res;
    },
    findMany: async ({ where, orderBy, include }) => {
      let list = db.assessments.filter((a) => a.userId === where.userId);
      if (orderBy?.createdAt === 'desc') {
        list = [...list].sort((a, b) => b.createdAt - a.createdAt);
      }
      return list.map((a) => {
        const res = { ...a };
        if (include?.recommendations) {
          res.recommendations = db.recommendations.filter((r) => r.assessmentId === a.id);
        }
        if (include?._count?.select?.simulations) {
          res._count = {
            simulations: db.simulations.filter((s) => s.assessmentId === a.id).length,
          };
        }
        return res;
      });
    },
    create: async ({ data, include }) => {
      const id = data.id || nextId('assessment');
      const { recommendations, ...directData } = data;
      const a = { id, createdAt: new Date(), ...directData };
      db.assessments.push(a);

      if (recommendations?.create) {
        recommendations.create.forEach((r) => {
          db.recommendations.push({
            id: nextId('rec'),
            assessmentId: id,
            createdAt: new Date(),
            ...r,
          });
        });
      }

      const res = { ...a };
      if (include?.recommendations) {
        res.recommendations = db.recommendations.filter((r) => r.assessmentId === id);
      }
      return res;
    },
  },
  recommendation: {
    findMany: async ({ where }) => {
      return db.recommendations.filter((r) => r.assessmentId === where.assessmentId);
    },
  },
  simulation: {
    create: async ({ data }) => {
      const s = {
        id: nextId('sim'),
        createdAt: new Date(),
        ...data,
      };
      db.simulations.push(s);
      return s;
    },
    findUnique: async ({ where, include }) => {
      const s = db.simulations.find((sim) => sim.id === where.id);
      if (!s) return null;
      const res = { ...s };
      if (include?.assessment) {
        const a = db.assessments.find((assess) => assess.id === s.assessmentId);
        res.assessment = a
          ? {
              id: a.id,
              totalEmission: a.totalEmission,
              sustainabilityScore: a.sustainabilityScore,
              userId: a.userId,
            }
          : null;
      }
      return res;
    },
  },
};

vi.mock('../utils/prismaClient.js', () => {
  return {
    default: mockPrisma,
  };
});

beforeEach(() => {
  db.users = [];
  db.assessments = [];
  db.recommendations = [];
  db.simulations = [];
  idCounter = 1;
});
