import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

// Create the AuthContext with default values
export const AuthContext = createContext({
    userId: null,
    role: null,
    email: null,
    branchId: null,
    setAuthToken: (token) => { },
    clearAuthToken: () => { },
});

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState(null);
    const [branchId, setBranchId] = useState(null);

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

    // Function to clear the auth token
    const clearAuthToken = () => {
        setUserId(null);
        setRole(null);
        setEmail(null);
        setBranchId(null);
        Cookies.remove('authToken');
    };

    // Load token from cookies on initial load
    useEffect(() => {
        const storedToken = Cookies.get('authToken');
        if (storedToken) {
            setAuthToken(storedToken);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ userId, role, email, branchId, setAuthToken, clearAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
};
