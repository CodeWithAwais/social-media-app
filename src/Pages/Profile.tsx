// Profile page (/profile/:username):
//   show user info — avatar, username, bio, followers
//   follow/unfollow button with count
//   show only posts by that user

import useAuth from '../hooks/useAuth';
import useFeed from '../hooks/useFeed';
import PostCard from '../components/PostCard';
import { useParams, useNavigate} from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserPlus, Grid, Trash2} from 'lucide-react';
import NewPost from '../components/NewPost';
import useUser from '../hooks/useUser';
import ConfirmModal from '../components/ConfirmModal';
import { useEffect, useState } from 'react';
 
function Profile() {
    const {posts, loadUserPosts} = useFeed();
    const navigate = useNavigate();
    const { username } = useParams();
    const { currentUser, deleteAccount } = useAuth();
    const { profileUser } = useUser();
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
 
    useEffect(() => {
        loadUserPosts();
    }, [])
    
    if (!currentUser) return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <p className="text-white/30">Please log in</p>
        </div>
    );
 
    if (profileUser?.username !== username) return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <p className="text-white/30">User not found</p>
        </div>
    );


    const handleAccountDelete = async () => {
        try {
            await deleteAccount(currentUser);
            navigate('/signup');
            setIsDeleteOpen(false);
        } catch(err){
            console.error('Account Deletion failed', err);
            setIsDeleteOpen(true);
        }
    }
 
    return (
        <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
            {/* Ambient blobs */}
            <div className="absolute top-0 left-[-15%] w-125 h-75 rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-87.5 h-87.5 rounded-full bg-pink-600/10 blur-[100px] pointer-events-none" />
 
            <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
 
                {/* Profile card */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 mb-6"
                >
                    {/* Avatar + follow */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="relative">
                            <img
                                className="w-20 h-20 rounded-2xl object-cover object-top ring-2 ring-purple-500/40"
                                src={profileUser?.photoURL}
                                alt={profileUser?.username}
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0a0a0f]" />
                        </div>

                        {/* Account Delete button */}
                        <button onClick={() => setIsDeleteOpen(true)} className="flex items-center gap-2 px-2 py-2 rounded-xl text-sm font-semibold border transition-all duration-300 cursor-pointer bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50">
                            <Trash2 />
                        </button>

                        {/* <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleFollow(profileUser?.username)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-300 cursor-pointer ${
                                user.isFollowing
                                    ? 'bg-white/5 border-white/10 text-white/50 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'
                                    : 'bg-linear-to-r from-purple-600 to-pink-600 border-transparent text-white shadow-lg shadow-purple-500/20'
                            }`}
                        >
                            {user.isFollowing
                                ? <><UserCheck className="w-4 h-4" /> Following</>
                                : <><UserPlus className="w-4 h-4" /> Follow</>
                            }
                        </motion.button> */}
                    </div>
 
                    {/* Name + bio */}
                    <div className="mb-4">
                        <h1 className="text-xl font-bold text-white mb-0.5">@{profileUser?.username}</h1>
                        <p className="text-white/40 text-sm leading-relaxed">{profileUser?.bio}</p>
                    </div>
 
                    {/* Stats */}
                    <div className="flex justify-between gap-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-400" />
                            <span className="text-white font-semibold">{profileUser?.followerCount?.toLocaleString()}</span>
                            <span className="text-white/30 text-sm">followers</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Grid className="w-4 h-4 text-pink-400" />
                            <span className="text-white font-semibold">{posts.length}</span>
                            <span className="text-white/30 text-sm">posts</span>
                        </div>
                    </div>
                    {/*  Button to create a new post, navigates to the create post page */}
                        <NewPost />
                    </div>
                </motion.div>

                {/* Modal Place */}

                <ConfirmModal isOpen={isDeleteOpen} title='Delete Account' message="You're going to delete your account. Are you sure?" confirmText='Yes, Delete it!' cancelText='No, Keep it.' onCancel={() => setIsDeleteOpen(false)} onConfirm={handleAccountDelete}/>

                {/* Posts section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-white/50 text-xs font-medium uppercase tracking-widest mb-4">Posts</h2>
 
                    {posts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-3xl mb-2">📭</p>
                            <p className="text-white/20 text-sm">No posts yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {posts.map((post, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.05 }}
                                >
                                    <PostCard post={post} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
 
export default Profile;