import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Landmark, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';
import { getItem, setItem, KEYS } from '../utils/localStorage';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const STEPS = ['Connect Account', 'Verify Identity', 'Your Details', 'Done'];

const partnerBanks = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Punjab National Bank',
];

export default function SignUp() {
  const [step, setStep] = useState(0);
  const [selectedBank, setSelectedBank] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', mobile: '', id: '', password: '' });
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  function handleConnectBank() {
    if (!selectedBank) return;
    setStep(1);
  }

  function handleVerifyOtp(e) {
    e.preventDefault();
    // Demo only — any 6-digit code is accepted, nothing is sent or verified for real.
    if (otp.length !== 6) {
      setOtpError('Enter the 6-digit demo OTP (e.g. 123456).');
      return;
    }
    setOtpError('');
    setStep(2);
  }

  function handleCreateAccount(e) {
    e.preventDefault();
    setFormError('');

    if (!form.name || !form.email || !form.mobile || !form.id || !form.password) {
      setFormError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    const users = getItem(KEYS.USERS, []);
    if (users.some((u) => u.id === form.id)) {
      setFormError('That ID is already taken. Choose another.');
      return;
    }

    const newUser = { id: form.id, password: form.password, name: form.name, email: form.email };
    setItem(KEYS.USERS, [...users, newUser]);
    setStep(3);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Landmark className="text-primary" size={28} />
          <span className="text-xl font-semibold text-text-primary">Ronak Bank</span>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-6">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-6 h-6 rounded-full text-[11px] flex items-center justify-center border ${
                    i <= step ? 'bg-primary border-primary text-white' : 'border-border text-slate-500'
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-[10px] text-slate-500 text-center hidden sm:block">{label}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 border border-border rounded-lg px-3 py-2 mb-5">
            This is a demo sign-up flow for a coursework project. No real bank account is connected
            and no real data is transmitted anywhere — everything below is simulated locally.
          </p>

          {/* Step 0: Connect bank account */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-1">Connect your bank account</h2>
                <p className="text-sm text-text-secondary">
                  Select your existing bank to link it with Ronak Bank (simulated).
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {partnerBanks.map((bank) => (
                  <button
                    key={bank}
                    onClick={() => setSelectedBank(bank)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-left text-sm ${
                      selectedBank === bank
                        ? 'border-primary bg-primary/10 text-text-primary'
                        : 'border-border text-text-secondary hover:bg-bg'
                    }`}
                  >
                    <Building2 size={16} className="text-slate-500" />
                    {bank}
                  </button>
                ))}
              </div>
              <Button onClick={handleConnectBank} disabled={!selectedBank} className="w-full mt-2">
                Continue
              </Button>
            </div>
          )}

          {/* Step 1: Verify identity (OTP) */}
          {step === 1 && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-1 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary" /> Verify identity
                </h2>
                <p className="text-sm text-text-secondary">
                  We've sent a demo OTP to your registered mobile for {selectedBank}. Enter any 6-digit code to continue.
                </p>
              </div>
              <Input
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                inputMode="numeric"
              />
              {otpError && <p className="text-expense text-sm">{otpError}</p>}
              <Button type="submit" className="w-full mt-2">Verify & Continue</Button>
            </form>
          )}

          {/* Step 2: Your details */}
          {step === 2 && (
            <form onSubmit={handleCreateAccount} className="flex flex-col gap-3">
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-1">Create your login</h2>
                <p className="text-sm text-text-secondary">Set up your Ronak Bank ID and password.</p>
              </div>
              <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Mobile Number" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="+91 98765 43210" />
              <Input label="Choose an ID / Username" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
              <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              {formError && <p className="text-expense text-sm">{formError}</p>}
              <Button type="submit" className="w-full mt-2">Create Account</Button>
            </form>
          )}

          {/* Step 3: Done */}
          {step === 3 && (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <CheckCircle2 size={40} className="text-income" />
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-1">Account created</h2>
                <p className="text-sm text-text-secondary">
                  Welcome to Ronak Bank, {form.name}. Sign in with your new ID <span className="text-text-primary">{form.id}</span> to continue.
                </p>
              </div>
              <Button onClick={() => navigate('/')} className="w-full">Go to Sign In</Button>
            </div>
          )}
        </div>

        {step < 3 && (
          <p className="text-center text-sm text-text-secondary mt-4">
            Already have an account?{' '}
            <Link to="/" className="text-primary hover:underline">Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
