import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import RoleLayout from '../components/layouts/RoleLayout';
import { routeNames } from '../constaints/routeName';
import { userRoles } from '../constaints/userRoles';
import { AuthContext } from '../context/AuthContext';
import BookingManagementAdminPage from '../pages/Booking/BookingManagementAdminPage';
import BookingPage from '../pages/Booking/BookingPage';
import BranchChoosePage from '../pages/Booking/BranchChoosePage';
import CalendarPage from '../pages/Booking/CalendarPage';
import BranchManagementAdminPage from '../pages/Branch/BranchManagementAdminPage';
import HomePage from '../pages/Common/HomePage';
import NotFoundPage from '../pages/Common/NotFoundPage';
import SignInPage from '../pages/Common/SignInPage';
import UserManagementAdminPage from '../pages/Users/UserManagementAdminPage';
import HomePageAdmin from '../pages/Home/HomePageAdmin';
import HomePageBranchManager from '../pages/Home/HomePageBranchManager';
import HomePageGuest from '../pages/Home/HomePageGuest';
import DisableCalendarPage from '../pages/DisableBookingTime/DisableCalendarPage';
import DisableBranchChoosePage from '../pages/DisableBookingTime/DisableBranchChoosePage';

const getUserRole = () => {
    const { role } = useContext(AuthContext);
    return role;
};

const PrivateRoute = ({ element, allowedRoles }) => {
    const userRole = getUserRole();

    return allowedRoles.includes(userRole) ? element : <Navigate to={routeNames.notFound} />;
};

const AppRoutes = () => {
    return (
        <RoleLayout>
            <Routes>
                <Route path={routeNames.index} element={<HomePage />} />
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

                <Route
                    path={routeNames.user.management}
                    element={<PrivateRoute element={<UserManagementAdminPage />} allowedRoles={[userRoles.ADMIN]} />}
                />

                <Route
                    path={routeNames.booking.bookingPage}
                    element={<PrivateRoute element={<BookingPage />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER, userRoles.GUEST]} />}
                />
                <Route
                    path={routeNames.booking.branchChoose}
                    element={<PrivateRoute element={<BranchChoosePage />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER, userRoles.GUEST]} />}
                />
                <Route
                    path={routeNames.booking.management}
                    element={<PrivateRoute element={<BookingManagementAdminPage />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER]} />}
                />
                <Route
                    path={routeNames.booking.calendar}
                    element={<PrivateRoute element={<CalendarPage />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER, userRoles.GUEST]} />}
                />

                <Route
                    path={routeNames.disableTime.calendar}
                    element={<PrivateRoute element={<DisableCalendarPage />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER]} />}
                />
                <Route
                    path={routeNames.disableTime.branchChoose}
                    element={<PrivateRoute element={<DisableBranchChoosePage />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER]} />}
                />

                <Route
                    path={routeNames.branch.management}
                    element={<PrivateRoute element={<BranchManagementAdminPage />} allowedRoles={[userRoles.ADMIN]} />}
                />


                <Route path={routeNames.login} element={<SignInPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </RoleLayout>
    );
};

export default AppRoutes;
