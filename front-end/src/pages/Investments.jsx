import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { mockInvestments } from '../data/mockData';
import Button from '../components/ui/Button';

const periods = ['1D', '1W', '1M', '6M', '1Y'];

export default function Investments() {
  const [period, setPeriod] = useState('1Y');
  const [showInsights, setShowInsights] = useState(false);

  const chartData = period === '1Y'
    ? mockInvestments.performance
    : mockInvestments.performance.slice(-3);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-text-primary">Investments</h1>

      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-sm text-text-secondary mb-1">Total Portfolio Value</p>
        <span className="text-3xl font-semibold text-text-primary">
          ₹{mockInvestments.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-text-secondary">Portfolio Performance</p>
          <div className="flex gap-1">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-md text-xs border ${
                  period === p ? 'bg-primary text-white border-primary' : 'border-border text-text-secondary'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#E2E8F0' }}
              />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-text-secondary">Decisions Powered by Data</p>
          <Button variant="outline" onClick={() => setShowInsights((v) => !v)} className="flex items-center gap-2">
            <Sparkles size={14} /> Explore AI Insights
          </Button>
        </div>
        {showInsights && (
          <p className="text-sm text-text-secondary bg-bg border border-border rounded-lg p-3">
            Your portfolio grew 8% this quarter, driven primarily by tech holdings (AAPL, MSFT, NVDA).
            Consider rebalancing if any single position exceeds 30% of total value.
          </p>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg p-4 overflow-x-auto">
        <p className="text-sm text-text-secondary mb-3">Holdings</p>
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="text-left text-slate-500 text-xs border-b border-border">
              <th className="pb-2 font-normal">Symbol</th>
              <th className="pb-2 font-normal">Name</th>
              <th className="pb-2 font-normal">Units</th>
              <th className="pb-2 font-normal">Value</th>
              <th className="pb-2 font-normal">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockInvestments.holdings.map((h) => (
              <tr key={h.symbol}>
                <td className="py-2 text-text-primary font-medium">{h.symbol}</td>
                <td className="py-2 text-text-secondary">{h.name}</td>
                <td className="py-2 text-text-secondary">{h.units}</td>
                <td className="py-2 text-text-primary">₹{h.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className={`py-2 ${h.change >= 0 ? 'text-income' : 'text-expense'}`}>
                  {h.change >= 0 ? '+' : ''}{h.change}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
