import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="flex items-center justify-between gap-4 px-4 md:px-6 py-4 border-b border-border bg-bg sticky top-0 z-30">
      <div className="hidden sm:flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 w-full max-w-xs">
        <Search size={16} className="text-slate-500" />
        <input
          placeholder="Search"
          className="bg-transparent outline-none text-sm text-text-secondary w-full placeholder:text-slate-500"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="relative text-text-secondary hover:text-text-primary">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-expense text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
              {user?.name?.[0] ?? 'U'}
            </div>
            <span className="hidden sm:inline text-sm">{user?.name}</span>
            <ChevronDown size={16} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg overflow-hidden text-sm">
              <button
                onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                className="block w-full text-left px-3 py-2 hover:bg-bg text-text-secondary"
              >
                Profile
              </button>
              <button
                onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                className="block w-full text-left px-3 py-2 hover:bg-bg text-text-secondary"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 hover:bg-bg text-expense"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
