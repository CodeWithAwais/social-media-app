import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute() {
    const {isLoading, user} = useAuth();

    if (isLoading) return <p>Loading...</p>
    if (!user) {
        console.log('No user logged in')
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}

export default ProtectedRoute;