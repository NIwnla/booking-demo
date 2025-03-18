import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export const AuthContext = createContext({
    userId: null,
    role: null,
    email: null,
    branchId: null,
    isAuthenticated: null,
    loading: null,
    from: null,
    setAuthToken: (token) => { },
    clearAuthToken: () => { },
    setReturnPath: (path) => { },
});

export const AuthProvider = ({ children }) => {
    const [from, setFrom] = useState(null);
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState(null);
    const [branchId, setBranchId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Function to decode the JWT token and extract information
    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            // @ts-ignore
            const { sub, 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': userRole, id, branchId } = decoded;

            setUserId(id);
            setRole(userRole);
            setEmail(sub);
            setBranchId(branchId);
            setIsAuthenticated(true);

            // Store the token in cookies for 120 mins
            Cookies.set('authToken', token, { expires: 120 / (24 * 60) });


        } catch (error) {
            console.error('Invalid token:', error);
        }
    };

    // Function to set the token (and decode it)
    const setAuthToken = (newToken) => {
        decodeToken(newToken);
    };

    const setReturnPath = (path) => {
        setFrom(path);
        // Store in cookies for 5 minutes
        Cookies.set('returnPath', path, { expires: 5 / (24 * 60) });
    };

    // Load data from cookies on initial load
    useEffect(() => {
        try {
            const storedToken = Cookies.get('authToken');
            const storedPath = Cookies.get('returnPath');

            if (storedToken) {
                setAuthToken(storedToken);
            }
            if (storedPath) {
                setFrom(storedPath);
            }
        } catch (error) {
            console.error('Failed to fetch stored data:', error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearAuthToken = () => {
        setUserId(null);
        setRole(null);
        setEmail(null);
        setBranchId(null);
        setIsAuthenticated(false);
        setFrom(null);
        Cookies.remove('authToken');
        Cookies.remove('returnPath');
    };

    // Load token from cookies on initial load
    useEffect(() => {
        try {
            const storedToken = Cookies.get('authToken');
            if (storedToken) {
                setAuthToken(storedToken);
            }
        } catch (error) {
            console.error('Failed to fetch user role:', error);
            setIsAuthenticated(false)
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            userId,
            role,
            email,
            branchId,
            isAuthenticated,
            loading,
            from,
            setAuthToken,
            clearAuthToken,
            setReturnPath
        }}>
            {children}
        </AuthContext.Provider>
    );
};
