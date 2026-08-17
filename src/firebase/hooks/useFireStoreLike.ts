import { db } from '../firebase';
import {doc, serverTimestamp, runTransaction, increment,} from 'firebase/firestore';

function useFireStoreLike () {
    const toggleLike = async (postId: string, userId: string) => {
        const likeDocRef = doc(db, 'likes', `${postId}_${userId}`);
        const postDocRef = doc(db, 'posts', postId);

        await runTransaction(db, async (transaction) => {
            const likeSnap = await transaction.get(likeDocRef);
            if(likeSnap.exists()) {
                transaction.delete(likeDocRef);
                transaction.update(postDocRef, {likes: increment(-1)});
            }else {
                transaction.set(likeDocRef, {
                    postId: postId,
                    likedByUser: userId,
                    createdAt: serverTimestamp()
                });
                transaction.update(postDocRef, {likes: increment(1)})
            }
        })
    }

    return {toggleLike}
}

export default useFireStoreLike;