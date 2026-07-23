import { useState } from 'react';
import useFeed from '../hooks/useFeed';
import useUser from '../hooks/useUser';
import type { NewPostForm, Category } from '../types/index';
import { motion } from 'framer-motion';
import { ImageIcon, Tag, Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
 
const categories: { value: Exclude<Category, 'all'>; emoji: string }[] = [
    { value: 'tech', emoji: '💻' },
    { value: 'lifestyle', emoji: '✨' },
    { value: 'travel', emoji: '🌍' },
    { value: 'food', emoji: '🍜' },
];
 
function PostComposer() {
    const { profileUser } = useUser();
    const { createPost } = useFeed();
    const navigate = useNavigate();
    const [form, setForm] = useState<NewPostForm>({
        caption: '',
        imageUrl: '',
        category: 'tech',
    });
 
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.caption || !form.imageUrl || !profileUser) return;
        await createPost(profileUser, form);
        setForm({ caption: '', imageUrl: '', category: 'tech' });
        navigate('/feed');
    };
 
    return (
        <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
            {/* Ambient blobs */}
            <div className="absolute top-[-10%] right-[-5%] w-87.5 h-87.5 rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-75 h-75 rounded-full bg-pink-600/15 blur-[100px] pointer-events-none" />
 
            <div className="max-w-lg mx-auto px-4 py-8 relative z-10">
 
                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/feed')}
                    className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-6 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Back to feed</span>
                </motion.button>
 
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-2xl font-bold text-white mb-1">New Post</h1>
                    <p className="text-white/30 text-sm mb-6">Share something with the world</p>
 
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
 
                        {/* Caption */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:border-purple-500/50 transition-all duration-300">
                            <textarea
                                rows={4}
                                className="w-full bg-transparent text-white placeholder-white/20 outline-none text-sm resize-none leading-relaxed"
                                placeholder="What's on your mind?"
                                value={form.caption}
                                onChange={e => setForm({ ...form, caption: e.target.value })}
                            />
                        </div>
 
                        {/* Image URL */}
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-purple-500/50 transition-all duration-300">
                            <ImageIcon className="w-4 h-4 text-white/30 shrink-0" />
                            <input
                                type="url"
                                className="bg-transparent text-white placeholder-white/20 flex-1 outline-none text-sm"
                                placeholder="Paste an image URL..."
                                value={form.imageUrl}
                                onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                            />
                        </div>
 
                        {/* Category pills */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Tag className="w-3.5 h-3.5 text-white/30" />
                                <span className="text-white/30 text-xs uppercase tracking-widest font-medium">Category</span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {categories.map(cat => (
                                    <motion.button
                                        key={cat.value}
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setForm({ ...form, category: cat.value })}
                                        className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer ${
                                            form.category === cat.value
                                                ? 'bg-purple-500/30 border-purple-500/60 text-purple-200'
                                                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                                        }`}
                                    >
                                        {cat.emoji} {cat.value}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
 
                        {/* Submit */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!form.caption || !form.imageUrl}
                            className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/20 cursor-pointer mt-2"
                        >
                            <Send className="w-4 h-4" />
                            Publish Post
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
 
export default PostComposer;