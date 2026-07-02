// Your job — build AuthContext that:
// - holds user: User | null
// - has login(username: string) function
//   → sets user with fake data { id, username, avatar, bio, followers }
// - has logout() function
// - has isLoggedIn: boolean derived from user !== null

import { type ReactNode } from "react";
import { AuthContext } from '../types/index'
import useFirebaseAuth from "../firebase/hooks/useFirebaseAuth";

function AuthProvider({children} : {children: ReactNode}){
    const auth = useFirebaseAuth();
    
    return(<>
    <AuthContext.Provider value={auth}>
        {children}
    </AuthContext.Provider>
    </>)
}

export default AuthProvider;