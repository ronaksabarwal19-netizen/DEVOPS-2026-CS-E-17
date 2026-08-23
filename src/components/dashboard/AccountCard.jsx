import { CreditCard } from 'lucide-react';

export default function AccountCard({ account }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 min-w-[220px] flex-1">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-text-secondary">{account.name}</span>
        <CreditCard size={18} className="text-slate-500" />
      </div>
      <p className="text-lg tracking-widest text-text-primary mb-3">
        **** **** **** {account.lastDigits}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-text-primary font-semibold">
          ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
        <span className="text-xs text-slate-400">{account.cardType}</span>
      </div>
    </div>
  );
}
