import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routeNames } from "../../constaints/routeName";
import { userRoles } from "../../constaints/userRoles";
import { AuthContext } from "../../context/AuthContext";

const RedirectFirstPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const { setAuthToken, from, isAuthenticated, role } = useContext(AuthContext);
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            setAuthToken(token);
            if (isAuthenticated) {
                let redirectPath;
                switch (role) {
                    case userRoles.ADMIN:
                        redirectPath = routeNames.dashboard.overview;
                        break;
                    case userRoles.BRANCH_MANAGER:
                    case userRoles.GUEST:
                    default:
                        redirectPath = routeNames.foodMenu.main;
                        break;
                }
                navigate(from || redirectPath, { replace: true });
            }
        } else {
            navigate(routeNames.landing, { replace: true });
        }
    }, [token, isAuthenticated, role, from, navigate]);

    return null;
}

export default RedirectFirstPage;