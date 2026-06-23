// Feed page:
//   category filter buttons at top
//   PostComposer to add new posts
//   filtered post list using useFilter hook

import useFilter from '../hooks/useFilter';
import useFeed from '../hooks/useFeed';
import type { Category } from '../types';
import PostCard from '../components/PostCard';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
 
const categories: { value: Category; emoji: string; label: string }[] = [
    { value: 'all', emoji: '⚡', label: 'All' },
    { value: 'tech', emoji: '💻', label: 'Tech' },
    { value: 'lifestyle', emoji: '✨', label: 'Lifestyle' },
    { value: 'travel', emoji: '🌍', label: 'Travel' },
    { value: 'food', emoji: '🍜', label: 'Food' },
];
 
function Feed() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { filteredPosts } = useFilter();
    const { setFilterCategory } = useFeed();
    const { from } = location.state || {};
    const filter = (searchParams.get('filter') ?? 'all') as Category;
 
    useEffect(() => {
        setFilterCategory(filter);
    }, [filter, setFilterCategory]);
 
    const handleFilterPost = (cat: Category) => {
        setSearchParams({ filter: cat });
    };
 
    return (
        <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
            {/* Ambient blobs */}
            <div className="absolute top-0 left-[-10%] w-100 h-100 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute top-[30%] right-[-5%] w-75 h-75 rounded-full bg-pink-600/10 blur-[100px] pointer-events-none" />
 
            <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
 
                {/* Success toast */}
                <AnimatePresence>
                    {from && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm px-4 py-2.5 rounded-xl mb-6"
                        >
                            <CheckCircle className="w-4 h-4" />
                            {from}
                        </motion.div>
                    )}
                </AnimatePresence>
 
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Your Feed</h1>
                        <p className="text-white/30 text-sm">{filteredPosts.length} posts</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/createpost')}
                        className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        New Post
                    </motion.button>
                </div>
 
                {/* Category filter pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 pt-2 scrollbar-none">
                    {categories.map(cat => (
                        <motion.button
                            key={cat.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleFilterPost(cat.value)}
                            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer ${
                                filter === cat.value
                                    ? 'bg-purple-500/30 border-purple-500/60 text-purple-200'
                                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'
                            }`}
                        >
                            <span>{cat.emoji}</span>
                            {cat.label}
                        </motion.button>
                    ))}
                </div>
 
                {/* Posts */}
                <div className="flex flex-col items-center gap-4">
                    <AnimatePresence>
                        {filteredPosts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <p className="text-4xl mb-3">🌌</p>
                                <p className="text-white/30 text-sm">No posts in this category yet</p>
                            </motion.div>
                        ) : (
                            filteredPosts.map((post, i) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="w-full flex justify-center"
                                >
                                    <PostCard post={post} />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
 
export default Feed;