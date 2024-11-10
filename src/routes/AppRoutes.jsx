import { Spin } from 'antd';
import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import UnavailableTimeAlert from '../components/alerts/UnavailableTimeAlert';
import { routeNames } from '../constaints/routeName';
import { userRoles } from '../constaints/userRoles';
import { AuthContext } from '../context/AuthContext';
import BookingEditPage from '../pages/Booking/BookingEditPage';
import BookingManagementAdminPage from '../pages/Booking/BookingManagementAdminPage';
import BookingPage from '../pages/Booking/BookingPage';
import BranchChoosePage from '../pages/Booking/BranchChoosePage';
import CalendarPage from '../pages/Booking/CalendarPage';
import BranchManagementAdminPage from '../pages/Branch/BranchManagementAdminPage';
import HomePage from '../pages/Common/HomePage';
import NotFoundPage from '../pages/Common/NotFoundPage';
import SignInPage from '../pages/Common/SignInPage';
import DisableBranchChoosePage from '../pages/DisableBookingTime/DisableBranchChoosePage';
import DisableCalendarPage from '../pages/DisableBookingTime/DisableCalendarPage';
import FoodManagementPageAdmin from '../pages/Food/FoodManagementPageAdmin';
import FoodOptionPageAdmin from '../pages/FoodOption/FoodOptionPageAdmin';
import HomePageAdmin from '../pages/Home/HomePageAdmin';
import HomePageBranchManager from '../pages/Home/HomePageBranchManager';
import HomePageGuest from '../pages/Home/HomePageGuest';
import UserManagementAdminPage from '../pages/Users/UserManagementAdminPage';
import RoleLayout from '../components/layouts/RoleLayout';


const PrivateRoute = ({ element, allowedRoles }) => {
    const { role, isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return <Spin spinning></Spin>
    }

    if (isAuthenticated === false) {
        // Redirect to the login page if the user is not authenticated
        return <Navigate to={routeNames.login} />;
    }

    // Once the role is loaded, check if it's allowed to view the page
    return allowedRoles.includes(role) ? element : <Navigate to={routeNames.notFound} />;
};

const AppRoutes = () => {
    return (
        <RoleLayout>
            <Routes>
                <Route path={routeNames.index} element={<HomePage />} />
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route
                    path={routeNames.homepage.admin}
                    element={<PrivateRoute element={<HomePageAdmin />} allowedRoles={[userRoles.ADMIN]} />}
                />
                <Route
                    path={routeNames.homepage.branchManager}
                    element={<PrivateRoute element={<HomePageBranchManager />} allowedRoles={[userRoles.BRANCH_MANAGER]} />}
                />
                <Route
                    path={routeNames.homepage.guest}
                    element={<PrivateRoute element={<HomePageGuest />} allowedRoles={[userRoles.GUEST]} />}
                />
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route
                    path={routeNames.user.management}
                    element={<PrivateRoute element={<UserManagementAdminPage />} allowedRoles={[userRoles.ADMIN]} />}
                />
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route path={routeNames.booking.bookingPage} element={<BookingPage />} />
                <Route path={routeNames.booking.branchChoose} element={<BranchChoosePage />} />
                <Route path={routeNames.booking.calendar} element={<CalendarPage />} />
                <Route path={routeNames.booking.unavailable} element={<UnavailableTimeAlert />} />
                <Route
                    path={routeNames.booking.management}
                    element={<PrivateRoute element={<BookingManagementAdminPage />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER]} />}
                />
                <Route
                    path={routeNames.booking.edit}
                    element={<PrivateRoute element={<BookingEditPage />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER, userRoles.GUEST]} />}
                />
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route
                    path={routeNames.disableTime.calendar}
                    element={<PrivateRoute element={<DisableCalendarPage />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER]} />}
                />
                <Route
                    path={routeNames.disableTime.branchChoose}
                    element={<PrivateRoute element={<DisableBranchChoosePage />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER]} />}
                />
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route
                    path={routeNames.branch.management}
                    element={<PrivateRoute element={<BranchManagementAdminPage />} allowedRoles={[userRoles.ADMIN]} />}
                />
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route path={routeNames.food.management} element={<FoodManagementPageAdmin />} />
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route
                    path={routeNames.foodOption.management}
                    element={<PrivateRoute element={<FoodOptionPageAdmin />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER]} />}
                />


                <Route path={routeNames.login} element={<SignInPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </RoleLayout>
    );
};

export default AppRoutes;
