// Login page:
//   username input
//   login button → sets user in context → navigate to feed

import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ArrowRight, Sparkles } from 'lucide-react';
 
function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [focused, setFocused] = useState(false);
 
    const handleLogin = () => {
        if (!username.trim()) return;
        login(username);
        navigate('/feed', {
            state: { from: 'Logged in successfully!' },
            replace: true
        });
    };
    
    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleLogin();
    };
 
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden relative">
 
            {/* Ambient background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-125 h-125 rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-100 h-100 rounded-full bg-pink-600/20 blur-[120px] pointer-events-none" />
            <div className="absolute top-[40%] left-[50%] w-75 h-75 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
 
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                {/* Glass card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
 
                    {/* Logo / Brand */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex flex-col items-center mb-8"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
                        <p className="text-white/40 text-sm mt-1">Sign in to your account</p>
                    </motion.div>
 
                    {/* Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mb-4"
                    >
                        <label className="text-white/50 text-xs font-medium uppercase tracking-widest mb-2 block">
                            Username
                        </label>
                        <div className={`flex items-center gap-3 bg-white/5 border rounded-xl px-4 py-3 transition-all duration-300 ${
                            focused ? 'border-purple-500/70 shadow-lg shadow-purple-500/10' : 'border-white/10'
                        }`}>
                            <User className="w-4 h-4 text-white/30" />
                            <input
                                type="text"
                                className="bg-transparent text-white placeholder-white/20 flex-1 outline-none text-sm"
                                placeholder="Enter your username..."
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                onKeyDown={handleKey}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                            />
                        </div>
                    </motion.div>
 
                    {/* Login button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogin}
                            disabled={!username.trim()}
                            className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/20 cursor-pointer"
                        >
                            Sign in
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </motion.div>
 
                    {/* Footer hint */}
                    <p className="text-center text-white/20 text-xs mt-6">
                        No account needed — any username works
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
 
export default Login;