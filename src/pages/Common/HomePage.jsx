import React, { useContext } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routeNames } from "../../constaints/routeName";
import { userRoles } from "../../constaints/userRoles";
import { AuthContext } from "../../context/AuthContext";

const HomePage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const { role, setAuthToken } = useContext(AuthContext)
    const token = searchParams.get('token');
    const navigate = useNavigate();
    useEffect(() => {
        if (token) {
            setAuthToken(token)
        }
        if (role) {
            switch (role) {
                case userRoles.ADMIN:
                    navigate(routeNames.homepage.admin)
                    break;
                case userRoles.BRANCH_MANAGER:
                    navigate(routeNames.homepage.branchManager)
                    break;
                case userRoles.GUEST:
                    navigate(routeNames.homepage.guest)
                    break;
            }
        }
    }, [token])
    
    return (
            <div>
                <h1>This is the homepage</h1>
            </div>
    );
};

export default HomePage;
