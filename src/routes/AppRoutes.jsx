import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import CalendarPage from '../pages/Booking/CalendarPage';
import BookingPage from '../pages/Booking/BookingPage';
import { routeNames } from '../constaints/routeName';
import NotFoundPage from '../pages/Common/NotFoundPage';
import MainLayout from '../components/layouts/MainLayout';
import SignInPage from '../pages/Common/SignInPage';

// Mock function to get the current user's role
// Replace this with actual authentication logic
const getUserRole = () => {
    // Example: return 'admin' or 'user'
    return 'user'; // Default role for testing
};

const PrivateRoute = ({ element, allowedRoles }) => {
    const userRole = getUserRole();

    return allowedRoles.includes(userRole) ? element : <Navigate to="/unauthorized" />;
};

const AppRoutes = () => {
    return (
        <MainLayout>
            <Routes>
                <Route path={routeNames.index} element={<CalendarPage />} />
                <Route
                    path={routeNames.booking.bookingPage}
                    element={<PrivateRoute element={<BookingPage />} allowedRoles={['user', 'admin']} />}
                />
                <Route path={routeNames.login} element={<SignInPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </MainLayout>
    );
};

export default AppRoutes;