import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function SignIn() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const result = login(id, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Landmark className="text-primary" size={28} />
          <span className="text-xl font-semibold text-text-primary">
            Aurevia Bank
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-lg p-6 flex flex-col gap-4"
        >
          <h1 className="text-lg font-semibold text-text-primary mb-1">
            Sign In
          </h1>

          <Input
            label="ID / Username"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="user1"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && <p className="text-expense text-sm">{error}</p>}

          <Button type="submit" className="w-full mt-2">
            Sign In
          </Button>

          <p className="text-xs text-slate-500 mt-2">
            Try: user1 / password123
          </p>
        </form>

        <p className="text-center text-sm text-text-secondary mt-4">
          New to Aurevia Bank?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Open an account
          </Link>
        </p>
      </div>
    </div>
  );
}