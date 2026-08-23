import {
  Music, ShoppingCart, Landmark, ShoppingBasket, Coffee,
  Briefcase, Zap, Tv, Dumbbell, ShoppingBag, Receipt,
} from 'lucide-react';

const iconMap = {
  music: Music,
  'shopping-cart': ShoppingCart,
  landmark: Landmark,
  'shopping-basket': ShoppingBasket,
  coffee: Coffee,
  briefcase: Briefcase,
  zap: Zap,
  tv: Tv,
  dumbbell: Dumbbell,
  'shopping-bag': ShoppingBag,
};

export default function TransactionItem({ transaction }) {
  const Icon = iconMap[transaction.icon] || Receipt;
  const isPositive = transaction.amount > 0;

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-bg border border-border flex items-center justify-center text-slate-400">
          <Icon size={16} />
        </div>
        <div>
          <p className="text-sm text-text-primary">{transaction.name}</p>
          <p className="text-xs text-slate-500">{transaction.date}</p>
        </div>
      </div>
      <span className={`text-sm font-medium ${isPositive ? 'text-income' : 'text-expense'}`}>
        {isPositive ? '+' : '-'}₹{Math.abs(transaction.amount).toFixed(2)}
      </span>
    </div>
  );
}
