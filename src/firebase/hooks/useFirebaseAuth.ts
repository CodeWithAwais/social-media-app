import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         onAuthStateChanged, 
         GoogleAuthProvider,
         signInWithPopup, 
         signOut,
         updateProfile,
         type User ,
         getAdditionalUserInfo,
         deleteUser,
         reauthenticateWithPopup
         } from 'firebase/auth'
import useFirebaseFireStore from '../hooks/useFirebaseFireStore'
import { doc, deleteDoc } from 'firebase/firestore'

function useFirebaseAuth(){
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { setUserData } = useFirebaseFireStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const registerWithEmail = async (email: string, password: string, displayName: string): Promise<User> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName, photoURL: `https://avatars.dicebear.com/api/initials/${displayName}.svg` });
            await setUserData(userCredential.user);
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
            const info = getAdditionalUserInfo(userCredential);
            
            if(info?.isNewUser){
                await setUserData(userCredential.user);
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
    const deleteAccount = async (user: User) => {
        if(!user) return;
        
        await reauthenticateWithPopup(user, new GoogleAuthProvider());
        await deleteDoc(doc(db, 'users', user.uid));
        await deleteUser(user);
    }
    return { currentUser, isLoading, registerWithEmail, loginWithEmail, loginWithGoogle, logout, deleteAccount };
}

export default useFirebaseAuth;