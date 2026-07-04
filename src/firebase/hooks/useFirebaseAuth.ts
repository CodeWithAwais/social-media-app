import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         onAuthStateChanged, 
         GoogleAuthProvider,
         signInWithPopup, 
         signOut,
         updateProfile,
         type User ,
         getAdditionalUserInfo} from 'firebase/auth'
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function useFirebaseAuth(){
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const registerWithEmail = async (email: string, password: string, displayName: string): Promise<User> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName });
            const uid = userCredential.user.uid;
            await setDoc(doc(db, 'users', uid), {
                name: displayName,
                email: email,
                bio: '',
                followerCount: 0
            })
            return userCredential.user;
        } catch (error) {
            console.error("Error registering with email:", error);
            throw error;
        }
    }
    const loginWithEmail = async (email: string, password: string): Promise<User> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Error logging in with email:", error);
            throw error;
        }
    }
    const loginWithGoogle = async (): Promise<User> => {
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const uid = userCredential.user.uid;
            const info = getAdditionalUserInfo(userCredential);
            
            if(info?.isNewUser){
                await setDoc(doc(db, 'users', uid), {
                    name: userCredential.user.displayName ?? '',
                    email: userCredential.user.email ?? '',
                    bio: '',
                    followerCount: 0
                })
            }
            return userCredential.user;
        } catch (error) {
            console.error("Error logging in with Google:", error);
            throw error;
        }
    }
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }
    return {user, isLoading, registerWithEmail, loginWithEmail, loginWithGoogle, logout};
}

export default useFirebaseAuth;