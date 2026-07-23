
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { FeedContext, type Post } from '../types/index';
import type { QueryDocumentSnapshot } from 'firebase/firestore';
import useFireStorePosts from '../firebase/hooks/useFireStorePosts';
import useUser from '../hooks/useUser';

function FeedProvider({children}: {children: ReactNode}){
    const { profileUser } = useUser();
    const {getFeedPage, createPost, userPosts} = useFireStorePosts();
    const [feed, setFeed] = useState<Post[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | undefined>(undefined);
    const isLoadingRef = useRef(false);    
    const [hasMore, setHasMore] = useState(true);

    const loadUserPosts = async () => {
        if(!profileUser) return;
        const userPostsData = await userPosts(profileUser);
        setPosts(userPostsData);
    }
    const loadNewestPosts = async () => {
        const result = await getFeedPage();
        setFeed(prev => {
            const existingIds = new Set(prev.map(post => post.postId));
            const newOnes = result.posts.filter(post => !existingIds.has(post.postId));
            return [...newOnes, ...prev]
        })
        setLastVisible(result.lastVisible);
    }
    const loadFeed = async () => {
        if(isLoadingRef.current || !hasMore) return;
        isLoadingRef.current = true;
        try{
            const result = await getFeedPage(lastVisible);
            setFeed(prev => [...prev, ...result.posts]);
            setLastVisible(result.lastVisible);
            if(!result.lastVisible) setHasMore(false)
        } finally{
            isLoadingRef.current = false;
        }
    }
    
    useEffect(() => {
    const handleScroll = () => {
        const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;

            if (scrollPosition >= pageHeight - 300) {
            loadFeed();
        }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, [lastVisible]);

    return(<>
    <FeedContext.Provider value={
        {feed, createPost, posts, loadUserPosts, loadNewestPosts}
    } >
        {children}
    </FeedContext.Provider>
    </>)
}

export default FeedProvider;