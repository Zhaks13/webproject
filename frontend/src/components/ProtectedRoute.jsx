import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly = false }) {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (adminOnly && user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return children;
}
