import useAuth from '../hooks/useAuth'
import { useState, useEffect, type ReactNode } from "react";
import { UserContext, type UserProfile } from '../types/index'
import useFireStoreUser from "../firebase/hooks/useFireStoreUser";

function UserProvider({children} : {children: ReactNode}){
    const { currentUser } = useAuth();
    const { getUserData } = useFireStoreUser();
    const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfileUser = async () => {
        if(currentUser) {
            const user = await getUserData(currentUser);
            setProfileUser(user);
        }
        setIsLoading(false);
    }
    
    useEffect(() => {
        const getUser = async () => {
            if(currentUser) {
                const user = await getUserData(currentUser);
                setProfileUser(user);
            }
            setIsLoading(false);
        }
        getUser();
    }, [currentUser])
    
    return(<>
    <UserContext.Provider value={ {profileUser, isLoading, fetchProfileUser} }>
        {children}
    </UserContext.Provider>
    </>)
}

export default UserProvider;