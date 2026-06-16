import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { formatDateShort, formatNumber } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 text-sm" role="tooltip">
        <p className="text-slate-400 text-xs mb-2">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className="font-semibold" style={{ color: p.color }}>
            {formatNumber(p.value)} kg CO₂
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TrendChart({ assessments }) {
  if (!assessments?.length) return null;

  const data = [...assessments]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((a) => ({
      date: formatDateShort(a.createdAt),
      total: a.totalEmission,
      transport: a.transportEmission,
      energy: a.energyEmission,
      food: a.foodEmission,
    }));

  const globalAvg = 4700;
  const parisTarget = 2000;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-200 font-semibold" id="trend-chart-title">
          Footprint Trend Over Time
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-5 h-0.5 border-t-2 border-dashed border-amber-500/50" aria-hidden="true" />
            Global avg
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-5 h-0.5 border-t-2 border-dashed border-emerald-500/50" aria-hidden="true" />
            Paris target
          </span>
        </div>
      </div>

      {assessments.length < 2 ? (
        <div className="flex items-center justify-center h-48 text-center">
          <div>
            <p className="text-slate-400 text-sm mb-1">📈 Trend chart will appear here</p>
            <p className="text-slate-600 text-xs">Complete more assessments to track your progress over time</p>
          </div>
        </div>
      ) : (
        <div
          style={{ height: 220 }}
          role="img"
          aria-labelledby="trend-chart-title"
          aria-label={`Footprint trend: ${data.map(d => `${d.date}: ${d.total}kg`).join(', ')}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v/1000).toFixed(1)}t`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={globalAvg}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                strokeOpacity={0.5}
                label={{ value: 'Global Avg', fill: '#f59e0b', fontSize: 10, position: 'right' }}
              />
              <ReferenceLine
                y={parisTarget}
                stroke="#10b981"
                strokeDasharray="5 5"
                strokeOpacity={0.5}
                label={{ value: 'Target', fill: '#10b981', fontSize: 10, position: 'right' }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#34d399"
                strokeWidth={2.5}
                dot={{ fill: '#34d399', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#34d399', strokeWidth: 2, stroke: '#0a0f1a' }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
