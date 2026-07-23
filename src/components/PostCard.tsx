// PostCard — shows:
//   avatar, username, caption, image, like button with count
//   category tag, liked/unliked state

import { type Post } from '../types/index';
import { Heart, Tag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
 
interface PostCardProps {
    post: Post;
}
 
const categoryColors: Record<string, string> = {
    tech: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    lifestyle: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    travel: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    food: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    all: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};
 
function PostCard({ post }: PostCardProps) {
 
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-lg bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            className="w-9 h-9 rounded-full object-cover object-top ring-2 ring-purple-500/40"
                            src={post.avatar}
                            alt={post.username}
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0a0f]" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-semibold leading-none">@{post.username}</p>
                        <p className="text-white/30 text-xs mt-0.5">
                            {post.createdAt.toDate().toLocaleDateString()}
                        </p>
                    </div>
                </div>
 
                {/* Category badge */}
                <div className=" flex gap-2 items-center">
                    <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${categoryColors[post.category] ?? categoryColors.all}`}>
                    <Tag className="w-3 h-3" />
                    {post.category}
                    </span>
                    <button 
                        // onClick={() => removePosts(post.id)}
                        className="text-white/30 hover:text-red-400 transition-colors duration-200 cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                
            </div>
 
            {/* Image */}
            <div className="relative overflow-hidden">
                <img
                    className="w-full aspect-square object-cover"
                    src={post.imageUrl}
                    alt={post.caption}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>
 
            {/* Footer */}
            <div className="px-4 py-3">
                <p className="text-white/80 text-sm mb-3 leading-relaxed">{post.caption}</p>
 
                <div className="flex items-center gap-2">
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        // onClick={() => toggleLike(post.id)}
                        className="flex items-center gap-1.5 cursor-pointer group"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                // key={post.isLiked ? 'liked' : 'unliked'}
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                            >
                                <Heart
                                    className="w-5 h-5 transition-colors duration-200"
                                    // fill={post.isLiked ? '#ec4899' : 'none'}
                                    // stroke={post.isLiked ? '#ec4899' : 'rgb(255 255 255 / 0.3)'}
                                />
                            </motion.div>
                        </AnimatePresence>
                        <span className={`text-sm font-medium transition-colors duration-200 `}>
                            {post.likes}
                        </span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
 
export default PostCard;