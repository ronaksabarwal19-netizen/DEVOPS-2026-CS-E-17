import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { getItem, setItem, KEYS } from '../utils/localStorage';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import TransactionItem from '../components/dashboard/TransactionItem';

export default function Payments() {
  const [accounts, setAccounts] = useState([]);
  const [payees, setPayees] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ recipient: '', amount: '', note: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setAccounts(getItem(KEYS.ACCOUNTS, []));
    setPayees(getItem(KEYS.PAYEES, []));
    setTransactions(getItem(KEYS.TRANSACTIONS, []));
  }, []);

  function handleSend(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const amount = parseFloat(form.amount);

    if (!form.recipient || !amount || amount <= 0) {
      setError('Enter a valid recipient and amount.');
      return;
    }

    const primaryAccount = accounts[0];
    if (!primaryAccount || primaryAccount.balance < amount) {
      setError('Insufficient balance in primary account.');
      return;
    }

    const updatedAccounts = accounts.map((acc, i) =>
      i === 0 ? { ...acc, balance: acc.balance - amount } : acc
    );
    setAccounts(updatedAccounts);
    setItem(KEYS.ACCOUNTS, updatedAccounts);

    const newTransaction = {
      id: `t${Date.now()}`,
      name: `Payment to ${form.recipient}`,
      amount: -amount,
      date: new Date().toISOString().slice(0, 10),
      type: 'payment',
      icon: 'send',
    };
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    setItem(KEYS.TRANSACTIONS, updatedTransactions);

    setSuccess(`Sent ₹${amount.toFixed(2)} to ${form.recipient}`);
    setForm({ recipient: '', amount: '', note: '' });
  }

  const paymentHistory = transactions.filter((t) => t.type === 'payment');

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-text-primary">Payments</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <form onSubmit={handleSend} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
            <p className="text-sm text-text-secondary mb-1 flex items-center gap-2">
              <Send size={16} /> Send Money
            </p>
            <Input
              label="Recipient Name / ID"
              value={form.recipient}
              onChange={(e) => setForm({ ...form, recipient: e.target.value })}
            />
            <Input
              label="Amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <Input
              label="Note (optional)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
            {error && <p className="text-expense text-sm">{error}</p>}
            {success && <p className="text-income text-sm">{success}</p>}
            <Button type="submit" className="w-full mt-2">Send</Button>
          </form>

          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-2">Payment History</p>
            {paymentHistory.length === 0 ? (
              <p className="text-xs text-slate-500">No payments yet.</p>
            ) : (
              <div className="divide-y divide-border">
                {paymentHistory.map((t) => (
                  <TransactionItem key={t.id} transaction={t} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 h-fit">
          <p className="text-sm text-text-secondary mb-3">Recent Payees</p>
          <div className="flex flex-col gap-2">
            {payees.map((p) => (
              <button
                key={p.id}
                onClick={() => setForm({ ...form, recipient: p.name })}
                className="flex items-center justify-between px-3 py-2 rounded-lg border border-border hover:bg-bg text-left"
              >
                <span className="text-sm text-text-primary">{p.name}</span>
                <span className="text-xs text-slate-500">{p.accountId}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
