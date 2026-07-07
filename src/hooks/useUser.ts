import { useContext } from "react";
import { UserContext } from '../types/index'

function useUser() {
    const user = useContext(UserContext);
    if(!user){
        throw new Error("useUser must be used within an UserProvider");
    }
    return user;
}

export default useUser;