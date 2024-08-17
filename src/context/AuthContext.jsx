import React, { createContext, useState } from 'react';

// Create the AuthContext with default values
export const AuthContext = createContext({
    role: null,
    email: null,
    setRole: (role) => { },
    setEmail: (email) => { }
});

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState(null);

    return (
        // @ts-ignore
        <AuthContext.Provider value={{ role, email, setRole, setEmail }}>
            {children}
        </AuthContext.Provider>
    );
};
