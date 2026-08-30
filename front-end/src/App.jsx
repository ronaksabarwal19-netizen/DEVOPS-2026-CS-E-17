// ─── Router & Auth ───────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// ─── Layout components (barrel import) ───────────────────────────────────────
import { ProtectedRoute, AppLayout } from './components/layout';

// ─── Pages ───────────────────────────────────────────────────────────────────
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Payments from './pages/Payments';
import Cards from './pages/Cards';
import Investments from './pages/Investments';
import Settings from './pages/Settings';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Wraps a page with auth guard + shared app chrome (Sidebar + Header). */
function Protected({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

// ─── App (root) ───────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes — require login */}
          <Route path="/dashboard"   element={<Protected><Dashboard /></Protected>} />
          <Route path="/accounts"    element={<Protected><Accounts /></Protected>} />
          <Route path="/payments"    element={<Protected><Payments /></Protected>} />
          <Route path="/cards"       element={<Protected><Cards /></Protected>} />
          <Route path="/investments" element={<Protected><Investments /></Protected>} />
          <Route path="/settings"    element={<Protected><Settings /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
