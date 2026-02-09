import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load auth from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('bookmart_token');
        const storedUser = localStorage.getItem('bookmart_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token: newToken, user: userData } = response.data;

            // Store in state
            setToken(newToken);
            setUser(userData);

            // Persist to localStorage
            localStorage.setItem('bookmart_token', newToken);
            localStorage.setItem('bookmart_user', JSON.stringify(userData));

            // Redirect based on role
            if (userData.role === 'seller') {
                navigate('/seller/home');
            } else {
                navigate('/buyer/home');
            }

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const signup = async (formData) => {
        try {
            await authAPI.signup(formData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('bookmart_token');
        localStorage.removeItem('bookmart_user');
        navigate('/auth');
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('bookmart_user', JSON.stringify(userData));
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isSeller: user?.role === 'seller',
        isBuyer: user?.role === 'user',
        login,
        signup,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
