import { useState, useEffect } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { getItem, setItem, KEYS } from '../utils/localStorage';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Checking', balance: '', lastDigits: '', cardType: 'Visa' });

  useEffect(() => {
    setAccounts(getItem(KEYS.ACCOUNTS, []));
  }, []);

  function handleAdd(e) {
    e.preventDefault();
    const newAccount = {
      id: `acc${Date.now()}`,
      name: form.name,
      type: form.type,
      balance: parseFloat(form.balance) || 0,
      lastDigits: form.lastDigits || '0000',
      cardType: form.cardType,
    };
    const updated = [...accounts, newAccount];
    setAccounts(updated);
    setItem(KEYS.ACCOUNTS, updated);
    setOpen(false);
    setForm({ name: '', type: 'Checking', balance: '', lastDigits: '', cardType: 'Visa' });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Accounts</h1>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
          <Plus size={16} /> Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-primary font-medium">{acc.name}</span>
              <Wallet size={18} className="text-slate-500" />
            </div>
            <p className="text-xs text-slate-500 mb-1">{acc.type}</p>
            <p className="text-sm text-text-secondary mb-3">**** {acc.lastDigits}</p>
            <p className="text-lg font-semibold text-text-primary">
              ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Account">
        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          <Input label="Account Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="bg-bg border border-border rounded-lg px-3 py-2 text-text-primary"
            >
              <option>Checking</option>
              <option>Savings</option>
              <option>Prepaid</option>
            </select>
          </div>
          <Input label="Initial Balance" type="number" step="0.01" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} required />
          <Input label="Last 4 Digits" maxLength={4} value={form.lastDigits} onChange={(e) => setForm({ ...form, lastDigits: e.target.value })} />
          <Button type="submit" className="w-full mt-2">Add Account</Button>
        </form>
      </Modal>
    </div>
  );
}
