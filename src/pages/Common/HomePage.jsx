import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const HomePage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const { setAuthToken } = useContext(AuthContext)
    const token = searchParams.get('token');
    useEffect(() => {
        if (token) {
            setAuthToken(token)
        }
    }, [token])

    return (
        <div>
            <h1>This is the homepage</h1>
        </div>
    );
};

export default HomePage;
