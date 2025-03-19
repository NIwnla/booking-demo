import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { routeNames } from "../../constaints/routeName";
import React from "react";

const RedirectFirstPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const { setAuthToken, from, isAuthenticated } = useContext(AuthContext);
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            setAuthToken(token);
            // Redirect to stored path or default to landing page
            if (isAuthenticated) {
                navigate(from || routeNames.landing, { replace: true });
            }
        } else {
            navigate(routeNames.landing, { replace: true });
        }
    }, [token, isAuthenticated, from, navigate]);

    return null;
}

export default RedirectFirstPage;