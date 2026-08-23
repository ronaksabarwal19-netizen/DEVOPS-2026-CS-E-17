import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getItem, setItem, KEYS } from '../utils/localStorage';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [pwMessage, setPwMessage] = useState('');
  const [notifs, setNotifs] = useState({ email: true, sms: false, push: true });

  useEffect(() => {
    setNotifs(getItem(KEYS.SETTINGS, { email: true, sms: false, push: true }));
  }, []);

  function handlePasswordChange(e) {
    e.preventDefault();
    setPwMessage('');

    const users = getItem(KEYS.USERS, []);
    const idx = users.findIndex((u) => u.id === user?.id);
    if (idx === -1) return;

    if (users[idx].password !== passwords.current) {
      setPwMessage('Current password is incorrect.');
      return;
    }
    if (passwords.next.length < 6) {
      setPwMessage('New password must be at least 6 characters.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPwMessage('New passwords do not match.');
      return;
    }

    users[idx] = { ...users[idx], password: passwords.next };
    setItem(KEYS.USERS, users);
    setPasswords({ current: '', next: '', confirm: '' });
    setPwMessage('Password updated successfully.');
  }

  function toggleNotif(key) {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    setItem(KEYS.SETTINGS, updated);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <h1 className="text-xl font-semibold text-text-primary">Settings</h1>

      <form onSubmit={handlePasswordChange} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
        <p className="text-sm text-text-secondary mb-1">Change Password</p>
        <Input label="Current Password" type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
        <Input label="New Password" type="password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} />
        <Input label="Confirm New Password" type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
        {pwMessage && (
          <p className={`text-sm ${pwMessage.includes('successfully') ? 'text-income' : 'text-expense'}`}>{pwMessage}</p>
        )}
        <Button type="submit" className="w-full mt-2">Update Password</Button>
      </form>

      <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
        <p className="text-sm text-text-secondary mb-1">Notification Preferences</p>
        {['email', 'sms', 'push'].map((key) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-text-secondary capitalize">{key} notifications</span>
            <button
              onClick={() => toggleNotif(key)}
              className={`w-10 h-5 rounded-full transition-colors relative ${notifs[key] ? 'bg-primary' : 'bg-border'}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifs[key] ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">Theme</p>
          <p className="text-xs text-slate-500">Dark mode is the default and only theme in this app.</p>
        </div>
        <button disabled className="w-10 h-5 rounded-full bg-primary opacity-50 relative cursor-not-allowed">
          <span className="absolute top-0.5 translate-x-5 w-4 h-4 rounded-full bg-white" />
        </button>
      </div>

      <Button variant="danger" onClick={handleLogout} className="w-full">Logout</Button>
    </div>
  );
}
