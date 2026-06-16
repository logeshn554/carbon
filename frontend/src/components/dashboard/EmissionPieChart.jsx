import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../../utils/constants';
import { formatNumber } from '../../utils/formatters';

const COLORS = [
  CATEGORY_COLORS.transport,
  CATEGORY_COLORS.energy,
  CATEGORY_COLORS.food,
  CATEGORY_COLORS.shopping,
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div
        className="glass-card px-4 py-3 text-sm"
        style={{ minWidth: 160 }}
        role="tooltip"
      >
        <p className="font-semibold text-slate-200 mb-1">{d.name}</p>
        <p className="text-slate-300">{formatNumber(d.value)} kg CO₂</p>
        <p className="text-slate-500">{d.percent?.toFixed(1)}% of total</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => (
  <ul className="flex flex-wrap justify-center gap-3 mt-2" role="list">
    {payload?.map((entry) => (
      <li key={entry.value} className="flex items-center gap-1.5 text-xs text-slate-400">
        <span
          className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
          style={{ background: entry.color }}
          aria-hidden="true"
        />
        {entry.value}
      </li>
    ))}
  </ul>
);

export default function EmissionPieChart({ assessment }) {
  const data = [
    { name: CATEGORY_LABELS.transport, value: assessment.transportEmission, key: 'transport' },
    { name: CATEGORY_LABELS.energy, value: assessment.energyEmission, key: 'energy' },
    { name: CATEGORY_LABELS.food, value: assessment.foodEmission, key: 'food' },
    { name: CATEGORY_LABELS.shopping, value: assessment.shoppingEmission, key: 'shopping' },
  ]
    .filter((d) => d.value > 0)
    .map((d) => ({ ...d, percent: (d.value / assessment.totalEmission) * 100 }));

  return (
    <div className="glass-card p-6">
      <h3 className="text-slate-200 font-semibold mb-4" id="pie-chart-title">
        Emission Sources Breakdown
      </h3>
      <div
        style={{ height: 280 }}
        role="img"
        aria-labelledby="pie-chart-title"
        aria-describedby="pie-chart-desc"
      >
        <p id="pie-chart-desc" className="sr-only">
          Pie chart showing emission breakdown:{' '}
          {data.map((d) => `${d.name}: ${d.percent.toFixed(1)}%`).join(', ')}
        </p>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
