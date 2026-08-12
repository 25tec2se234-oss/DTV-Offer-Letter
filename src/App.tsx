import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ShieldCheck, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import OfferLetterApp from './pages/OfferLetterStudio/OfferLetterApp'
import CandidatePortal from './pages/OfferLetterStudio/CandidatePortal'
import PublicVerification from './pages/OfferLetterStudio/PublicVerification'

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'kar98kbi@gmail.com' && password === 'Kart@2012$2003') {
      sessionStorage.setItem('dtv_admin_auth', 'true');
      onLogin();
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#161920] max-w-md w-full rounded-3xl shadow-2xl p-10 border border-white/10">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
          <ShieldCheck className="w-8 h-8 text-indigo-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2 text-center">Admin Access</h2>
        <p className="text-gray-400 text-sm text-center mb-8">Secure login required to access Offer Letter Studio.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kar98kbi@gmail.com"
              className="w-full bg-[#0f1115] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0f1115] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
              required
            />
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Login to Studio
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: any }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem('dtv_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  if (checking) return null;

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/offer/action" element={<CandidatePortal />} />
        <Route path="/offer/verify" element={<PublicVerification />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <OfferLetterApp />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
