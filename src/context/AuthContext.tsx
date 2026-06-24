// Your job — build AuthContext that:
// - holds user: User | null
// - has login(username: string) function
//   → sets user with fake data { id, username, avatar, bio, followers }
// - has logout() function
// - has isLoggedIn: boolean derived from user !== null

import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type User } from '../types/index'

function AuthProvider({children} : {children: ReactNode}){
    
    const [user, setUser] = useState<User | null>(() => {
        return JSON.parse(localStorage.getItem('user') as string) || null
    });
    const isLoggedIn = user != null;
    function login(username: string){
        const fakeUser: User = {
        id: 'U-' + Math.random().toString(36).slice(2, 10),
        username: username,
        avatar: `https://i.pravatar.cc/150?u=${username}`,
        bio: 'Just exploring the App!',
        followers: Math.floor(Math.random() * 1000),
        isFollowing: false
        }
        setUser(fakeUser)
        
    }
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user))
    }, [user])
    function logout(){
            setUser(null);
    }
    function toggleFollow(username: string){
        setUser(prev => {
            if(username !== prev?.username)
                return prev;
            const newIsFollower = !prev.isFollowing;
            return {
                ...prev,
                isFollowing: newIsFollower,
                followers: newIsFollower ? prev.followers + 1 : prev.followers - 1
            }
        })
    }
    return(<>
    <AuthContext.Provider value={
        {user, login, logout, isLoggedIn, toggleFollow}
    }>
        {children}
    </AuthContext.Provider>
    </>)
}

export default AuthProvider;