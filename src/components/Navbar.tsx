// Navbar — shows:
//   app name, links to Feed + Profile
//   highlight active link
//   logout button if logged in

import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Home, User, LogOut, Heart } from 'lucide-react';
import useUser from '../hooks/useUser';
 
function Navbar() {
    const { logout } = useAuth();
    const { profileUser } = useUser();
 
    return (
        <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5"
        >
            <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
 
                {/* Brand */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/30">
                        <Heart className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">Social Media A</span>
                </div>
 
                {/* Nav links */}
                <div className="flex items-center gap-1">
                    <NavLink
                        to="/feed"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                            }`
                        }
                    >
                        <Home className="w-4 h-4" />
                        Feed
                    </NavLink>
 
                    <NavLink
                        to={`/profile/${profileUser?.username}`}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                            }`
                        }
                    >
                        <User className="w-4 h-4" />
                        Profile
                    </NavLink>
                </div>
 
                {/* Logout */}
                {(
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Sign out</span>
                    </motion.button>
                )}
            </div>
        </motion.nav>
    );
}
 
export default Navbar;