import {db, storage} from '../firebase';
import {getDocs, doc, serverTimestamp, query, QueryDocumentSnapshot, collection, orderBy, startAfter, where, deleteDoc, setDoc} from 'firebase/firestore';
import type { NewPostForm, Post, UserProfile} from '../../types';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

function useFireStorePosts(){
    const createPost = async (currentUser: UserProfile, form: NewPostForm) => {
        const postRef = doc(collection(db, 'posts'));
        const postId = postRef.id;

        let fileUrl = form.postUrl;
        let fileStoragePath = null;

        if(form.file){
            const fileExt = form.file.name.split('.').pop();
            const path = `posts/${currentUser.userId}/${postId}_${fileExt}`;
            const fileRef = ref(storage, path);

            await uploadBytes(fileRef, form.file);
            fileUrl = await getDownloadURL(fileRef);
            fileStoragePath = path;

        }
        await setDoc(postRef, {
            userId: currentUser.userId,
            username: currentUser.username,
            avatar: currentUser.photoURL,
            caption: form.caption,
            category: form.category,
            postUrl: fileUrl,
            fileStoragePath,
            likes: 0,
            createdAt: serverTimestamp(),
        })
    } 
    const deletePost = async (post: Post) => {
        if(!post) return;
        await deleteDoc(doc(db, 'posts', post.postId));
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
            {...doc.data() as Post, postId: doc.id}
        ))
        return posts;
    }

    return { createPost, getFeedPage, userPosts, deletePost };
}

export default useFireStorePosts;