import React from 'react';
// import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthLogout = () => {
    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            // Clear token from localStorage
            localStorage.removeItem('token');

            // Optional: Call backend to invalidate token
            await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                credentials: 'include',
            });

            // Navigate to login page
            navigate('/');
        } catch (error) {
            console.error('Signout error:', error);
            // Still remove token and redirect even if backend call fails
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    return (
        <button
            onClick={handleSignout}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
            <div className="mr-2 h-4 w-4" />
            Sign out
        </button>
    );
};

export default AuthLogout;