import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
    component: React.ComponentType;
    role: string;
}

const ProtectedRoute = ({ component: Component, role }: ProtectedRouteProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        validateToken();
    }, [navigate]);

    const validateToken = async () => {
        const user = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (1) {
            // if (user) {
            // const decodedToken = jwtDecode<any>(user);
            const decodedToken = { role: 'admin2' }
            if (decodedToken.role !== role) {
                navigate('/signin');
            }
            if (role === 'bypass') {
                console.log('bypass routes')
                navigate('/');
            }
            if (role === 'role-allow-routes') {
                console.log('bypass role-allow-routes')
                return <Component />;
            }
        } else {
            navigate('/signin');
            return null;
        }
    }

    return <Component />;
}

export default ProtectedRoute;
