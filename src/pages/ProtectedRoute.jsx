import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router';

// Route guard that redirects unauthenticated users to login.
export default function ProtectedRoute() {
    const { token } = useAuth();

    if(!token){
        return (
            <Navigate
                to={'/login'}
                state={{ message: 'Unauthorised user! Please login', type: 'error'}}
            />
        );
    }

    return (
        <Outlet />
    );

};
