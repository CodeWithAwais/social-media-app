// Your job — build FeedContext that:
// - holds posts: Post[] — start with 3 fake posts
// - has addPost(form: NewPostForm) function
//   → creates new post with random id, current user info
// - has toggleLike(postId: string) function
//   → flips isLiked, increments/decrements likes count
// - has filterCategory: Category state
// - has setFilterCategory function

import { useState, type ReactNode } from 'react';
import { FeedContext, type Category, type Post, type NewPostForm } from '../types/index';
import Sukuna from '../assets/sukuna.jpg'
import useAuth from '../hooks/useAuth'

const fakePosts : Post[] = [{
        id: 'P-001',
        userId: 'U-001',
        username: 'awais',
        avatar: Sukuna,
        caption: 'my first post',
        imageUrl: 'https://picsum.photos/200/300',
        likes: 0,
        isLiked: false,
        category: "tech",
        createdAt: Date.now().toString()
    },{
        id: 'P-002',
        userId: 'U-001',
        username: 'awais',
        avatar: Sukuna,
        caption: 'my 2nd post',
        imageUrl: 'https://picsum.photos/200/300',
        likes: 0,
        isLiked: false,
        category: "food",
        createdAt: Date.now().toString()
    },{
        id: 'P-003',
        userId: 'U-001',
        username: 'awais',
        avatar: Sukuna,
        caption: 'my 3rd post',
        imageUrl: 'https://picsum.photos/200/300',
        likes: 0,
        isLiked: false,
        category: 'travel',
        createdAt: Date.now().toString()
    }]

function FeedProvider({children}: {children: ReactNode}){
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>(fakePosts);
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
        {posts, addPost, toggleLike, filterCategory, setFilterCategory}
    } >
        {children}
    </FeedContext.Provider>
    </>)
}

export default FeedProvider;