import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getItem, KEYS } from '../utils/localStorage';
import AccountCard from '../components/dashboard/AccountCard';
import TransactionItem from '../components/dashboard/TransactionItem';
import SpendingChart from '../components/dashboard/SpendingChart';
import QuickActions from '../components/dashboard/QuickActions';

export default function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setAccounts(getItem(KEYS.ACCOUNTS, []));
    setTransactions(getItem(KEYS.TRANSACTIONS, []));
  }, []);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-text-primary">Welcome, {user?.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Total Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-text-primary">
                ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-income text-sm">+2.1% today</span>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-1">
            {accounts.slice(0, 3).map((acc) => (
              <AccountCard key={acc.id} account={acc} />
            ))}
          </div>

          <SpendingChart />
          <QuickActions />
        </div>

        <div className="bg-card border border-border rounded-lg p-4 h-fit">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-text-secondary">Recent Transactions</p>
            <Link to="/payments" className="text-xs text-primary hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-border">
            {transactions.slice(0, 7).map((t) => (
              <TransactionItem key={t.id} transaction={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
