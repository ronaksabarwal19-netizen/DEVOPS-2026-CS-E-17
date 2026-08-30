import { useState, useEffect } from 'react';
import { Snowflake } from 'lucide-react';
import { getItem, setItem, KEYS } from '../utils/localStorage';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Cards() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [frozen, setFrozen] = useState({});
  const [toast, setToast] = useState('');

  useEffect(() => {
    setAccounts(getItem(KEYS.ACCOUNTS, []));
    setFrozen(getItem(KEYS.CARDS_FROZEN, {}));
  }, []);

  function toggleFreeze(id) {
    const updated = { ...frozen, [id]: !frozen[id] };
    setFrozen(updated);
    setItem(KEYS.CARDS_FROZEN, updated);
  }

  function handleRequestCard() {
    setToast('Virtual card request submitted. It will appear within 1-2 business days.');
    setTimeout(() => setToast(''), 3000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Cards</h1>
        <Button onClick={handleRequestCard}>Request New Virtual Card</Button>
      </div>

      {toast && (
        <div className="bg-card border border-primary/40 text-primary text-sm rounded-lg px-4 py-2">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {accounts.map((acc) => {
          const isFrozen = !!frozen[acc.id];
          return (
            <div
              key={acc.id}
              className={`rounded-lg border border-border p-5 flex flex-col justify-between h-40 transition-opacity ${
                isFrozen ? 'opacity-40 bg-card' : 'bg-card'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-text-primary font-medium">{acc.name}</span>
                <span className="text-xs text-slate-400">{acc.cardType}</span>
              </div>
              <p className="text-lg tracking-widest text-text-primary">**** **** **** {acc.lastDigits}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Card Holder</p>
                  <p className="text-sm text-text-secondary">{user?.name}</p>
                </div>
                <button
                  onClick={() => toggleFreeze(acc.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border ${
                    isFrozen ? 'border-primary text-primary' : 'border-border text-text-secondary'
                  }`}
                >
                  <Snowflake size={14} />
                  {isFrozen ? 'Unfreeze' : 'Freeze'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
