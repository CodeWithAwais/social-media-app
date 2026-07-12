import {db} from '../firebase'
import {doc, getDoc, setDoc, serverTimestamp, updateDoc} from 'firebase/firestore';
import {type User} from 'firebase/auth';
import { type UserProfile } from '../../types/index';
// import { useState } from 'react';

function useFirebaseFireStore(){
    // const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
    const setUserData = async (user: User) => {
        if(!user) return;
        await setDoc(doc(db, 'users', user.uid), {
                displayName: user.displayName ?? '',
                username: null,
                photoURL: user.photoURL ?? '',
                email: user.email ?? '',
                bio: '',
                followerCount: 0,
                createdAt: serverTimestamp(),
        })
    }
    const getUserData = async (user: User): Promise<UserProfile | null> => {
        if(!user) return null;
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if(docSnap.exists()){
            return docSnap.data() as UserProfile;
        } else {
            console.log('this user doesnt exist!')
            return null;
        }
    }
    const updateUserData = async (user: User, updates: Partial<UserProfile>) => {
        if(!user) return;
        await updateDoc(doc(db, 'users', user.uid), updates)
    }
    return { setUserData, getUserData, updateUserData };
}

export default useFirebaseFireStore;