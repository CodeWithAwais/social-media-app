import {db} from '../firebase';
import {getDocs, addDoc, serverTimestamp, query, QueryDocumentSnapshot, collection, orderBy, startAfter, where} from 'firebase/firestore';
import type { NewPostForm, Post, UserProfile } from '../../types';

function useFireStorePosts(){
    const createPost = async (currentUser: UserProfile, form: NewPostForm) => {
        await addDoc(collection(db, 'posts'), {
            userId: currentUser.userId,
            username: currentUser.username,
            avatar: currentUser.photoURL,
            caption: form.caption,
            category: form.category,
            imageUrl: form.imageUrl,
            likes: 0,
            createdAt: serverTimestamp(),
        })
    }
    const deletePosts = async () => {
        
    }
    const getFeedPage = async (lastVisibleDoc?: QueryDocumentSnapshot) => {
        const baseQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const q = lastVisibleDoc ? query(baseQuery, startAfter(lastVisibleDoc)) : baseQuery;
        const feedSnap = await getDocs(q);
        const lastVisible = feedSnap.docs[feedSnap.docs.length - 1];
        return {
            posts: feedSnap.docs.map(doc => (
                {...doc.data() as Post,
                postId: doc.id}
            )),
            lastVisible
        }
    }

    const userPosts = async (currentUser: UserProfile) => {
        const q  = query(collection(db, 'posts'), where('userId', '==', currentUser.userId), orderBy('createdAt', 'desc'));
        const postsSnap = await getDocs(q);
        const posts = postsSnap.docs.map(doc => (
            {...doc.data() as Post}
        ))
        return posts;
    }
    return { createPost, getFeedPage, userPosts };
}

export default useFireStorePosts;