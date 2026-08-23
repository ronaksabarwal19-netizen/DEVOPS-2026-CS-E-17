import { useState } from 'react';
import { Send, Receipt, ArrowUpCircle, ScanLine } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const actions = [
  { label: 'Send Money', icon: Send },
  { label: 'Pay Bills', icon: Receipt },
  { label: 'Top Up', icon: ArrowUpCircle },
  { label: 'Scan', icon: ScanLine },
];

export default function QuickActions() {
  const [active, setActive] = useState(null);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-sm text-text-secondary mb-3">Quick actions</p>
      <div className="grid grid-cols-4 gap-2">
        {actions.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActive(label)}
            className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-bg text-text-secondary text-xs"
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active}>
        <p className="text-sm text-text-secondary mb-4">
          This is a placeholder for the "{active}" action — not wired up to real functionality yet.
        </p>
        <Button onClick={() => setActive(null)} className="w-full">Close</Button>
      </Modal>
    </div>
  );
}
