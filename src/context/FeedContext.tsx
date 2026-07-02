// Your job — build FeedContext that:
// - holds posts: Post[] — start with 3 fake posts
// - has addPost(form: NewPostForm) function
//   → creates new post with random id, current user info
// - has toggleLike(postId: string) function
//   → flips isLiked, increments/decrements likes count
// - has filterCategory: Category state
// - has setFilterCategory function

import { useEffect, useState, type ReactNode } from 'react';
import { FeedContext, type Category, type Post, type NewPostForm } from '../types/index';
import useAuth from '../hooks/useAuth'

function FeedProvider({children}: {children: ReactNode}){
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>(() => {
        const savedPosts = localStorage.getItem('posts');
        return savedPosts ? (JSON.parse(savedPosts) as Post[]) : []
    });
    const [filterCategory, setFilterCategory] = useState<Category>("all");  
    function addPost(form: NewPostForm){
        if(!user) return;
        setPosts(prev => ([...prev, {
            id: 'P-' + Math.random().toString(36).slice(2, 7),
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            caption: form.caption,
            imageUrl: form.imageUrl,
            likes: 0,
            isLiked: false,
            category: form.category,
            createdAt: Date.now().toString()
        }]))
    }
    function removePosts(postId : string){
        const newPosts = posts.filter(p => p.id !== postId)
        setPosts(newPosts);
    }
    useEffect(() => {
        localStorage.setItem('posts', JSON.stringify(posts))
    }, [posts])
    function toggleLike(postId: string){
        setPosts(prev => prev.map(post => {
            if(post.id !== postId)
                return post;
            const newIsLiked = !post.isLiked;
            return{
                ...post, isLiked: newIsLiked,
                likes: newIsLiked ? post.likes + 1 : post.likes - 1 
            }
        }))
    }
    return(<>
    <FeedContext.Provider value={
        {posts, addPost, toggleLike, filterCategory, setFilterCategory, removePosts}
    } >
        {children}
    </FeedContext.Provider>
    </>)
}

export default FeedProvider;