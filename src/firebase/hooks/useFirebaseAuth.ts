import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         onAuthStateChanged, 
         GoogleAuthProvider,
         signInWithPopup, 
         signOut,
         updateProfile,
         type User } from 'firebase/auth'

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

    const registerWithEmail = async (email: string, password: string, displayName: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName });
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
    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
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