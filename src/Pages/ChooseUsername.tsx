import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, } from 'lucide-react';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useFireStoreUser from '../firebase/hooks/useFireStoreUser';
import useUser from '../hooks/useUser';

function ChooseUsername() {
    const {fetchProfileUser} = useUser();
    const { updateUserData } = useFireStoreUser();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [focused, setFocused] = useState(false);
    const [username, setUsername] = useState('');
    const handleUsername = async () => {
        if(!currentUser) return;
        await updateUserData(currentUser, {username: username});
        await fetchProfileUser();
        navigate('/feed', {
                state: { from: 'Account created successfully!' },
                replace: true
            });
    }
    return(<>

    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden relative">
        {/* Ambient background blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-125 h-125 rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-100 h-100 rounded-full bg-pink-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-[40%] left-[50%] w-75 h-75 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

        <div className="flex-col">
        {/* Input Username */}
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
                    placeholder="Enter your Username..."
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
            </div>
        </motion.div>

        {/* Signup button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleUsername}
                            disabled={!username.trim()}
                            className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/20 cursor-pointer"
                        >
                            Sign Up
                        </motion.button>
                    </motion.div>
        </div>
    </div>
    </>)
}

export default ChooseUsername;