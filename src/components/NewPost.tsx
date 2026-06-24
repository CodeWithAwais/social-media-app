import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function NewPost() {
    const navigate = useNavigate();

    return (    
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/createpost')}
        className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-purple-500/20 transition-all duration-300 cursor-pointer"
    >
        <Plus className="w-4 h-4" />
            New Post
    </motion.button>
    );
}

export default NewPost;