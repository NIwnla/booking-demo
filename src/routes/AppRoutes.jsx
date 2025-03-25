import { Spin } from "antd";
import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import UnavailableTimeAlert from "../components/alerts/UnavailableTimeAlert";
import RoleLayout from "../components/layouts/RoleLayout";
import { routeNames } from "../constaints/routeName";
import { userRoles } from "../constaints/userRoles";
import { AuthContext } from "../context/AuthContext";
import BookingEditPage from "../pages/Booking/BookingEditPage";
import BookingManagementAdminPage from "../pages/Booking/BookingManagementAdminPage";
import BookingPage from "../pages/Booking/BookingPage";
import BranchChoosePage from "../pages/Booking/BranchChoosePage";
import CalendarPage from "../pages/Booking/CalendarPage";
import BranchManagementAdminPage from "../pages/Branch/BranchManagementAdminPage";
import ApplicationManagementPageAdmin from "../pages/Career/Application/ApplicationManagementPageAdmin";
import RecruitInformationDetail from "../pages/Career/Application/RecruitInformationDetail";
import CareerSignUpPage from "../pages/Career/CareerSignUpPage";
import FindJobsPage from "../pages/Career/FindJobs/FindJobsPage";
import JobOfferDetail from "../pages/Career/FindJobs/JobOfferDetail";
import CareerMainPage from "../pages/Career/MainPage/CareerMainPage";
import CreateJobOffer from "../pages/Career/Management/CreateJobOffer";
import EditJobOffer from "../pages/Career/Management/EditJobOffer";
import JobOfferDetailAdmin from "../pages/Career/Management/JobOfferDetailAdmin";
import JobOfferManagementPage from "../pages/Career/Management/JobOfferManagementPage";
import CategoryManagementAdminPage from "../pages/Category/CategoryManagementAdmin";
import LandingPage from "../pages/Common/LandingPage/LandingPage";
import NotFoundPage from "../pages/Common/NotFoundPage";
import RedirectFirstPage from "../pages/Common/RedirectFirstPage";
import SignInPage from "../pages/Common/SignInPage";
import BranchDashboard from "../pages/Dashboard/BranchDashboard";
import DashboardOverview from "../pages/Dashboard/DashboardOverview";
import DeliveryCreationPage from "../pages/Delivery/DeliveryCreationPage";
import DeliveryManagementPageAdmin from "../pages/Delivery/DeliveryManagementPageAdmin";
import DisableBranchChoosePage from "../pages/DisableBookingTime/DisableBranchChoosePage";
import DisableCalendarPage from "../pages/DisableBookingTime/DisableCalendarPage";
import FoodManagementPageAdmin from "../pages/Food/FoodManagementPageAdmin";
import MyCartPage from "../pages/FoodMenu/CreateDelivery/MyCartPage";
import OrderInformationPage from "../pages/FoodMenu/CreateDelivery/OrderInformationPage";
import SMSConfirmPage from "../pages/FoodMenu/CreateDelivery/SMSConfirmPage";
import DetailedFoodPage from "../pages/FoodMenu/DetailedFoodPage";
import DetailedMenuPage from "../pages/FoodMenu/DetailedMenuPage";
import FoodMenuMainPage from "../pages/FoodMenu/FoodMenuMainPage";
import SearchResultPage from "../pages/FoodMenu/SearchResultPage";
import FoodOptionPageAdmin from "../pages/FoodOption/FoodOptionPageAdmin";
import HomePageAdmin from "../pages/Home/HomePageAdmin";
import HomePageBranchManager from "../pages/Home/HomePageBranchManager";
import HomePageGuest from "../pages/Home/HomePageGuest";
import ReservationForm from "../pages/Reservation/ReservationForm";
import ReservationPage from "../pages/Reservation/ReservationPage";
import UserProfilePage from "../pages/Users/Profile/UserProfilePage";
import UserManagementAdminPage from "../pages/Users/UserManagementAdminPage";



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
                <Route path={routeNames.index} element={<RedirectFirstPage />} />
                <Route path={routeNames.landing} element={<LandingPage />} />
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
                    path={routeNames.dashboard.overview}
                    element={<PrivateRoute element={<DashboardOverview />} allowedRoles={[userRoles.ADMIN]} />}
                />
                <Route
                    path={routeNames.dashboard.branch}
                    element={<PrivateRoute element={<BranchDashboard />} allowedRoles={[userRoles.ADMIN]} />}
                />
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route
                    path={routeNames.user.management}
                    element={<PrivateRoute element={<UserManagementAdminPage />} allowedRoles={[userRoles.ADMIN]} />}
                />
                <Route
                    path={routeNames.user.information}
                    element={<PrivateRoute element={<UserProfilePage />} allowedRoles={[userRoles.ADMIN]} />}
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
                    path={`${routeNames.foodOption.management}:id`}
                    element={<PrivateRoute element={<FoodOptionPageAdmin />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER]} />}
                />
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route path={routeNames.recruitInformation.signUp} element={<CareerSignUpPage />} />
                <Route
                    path={routeNames.recruitInformation.management}
                    element={<PrivateRoute element={<ApplicationManagementPageAdmin />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER]} />}
                />
                <Route
                    path={`${routeNames.recruitInformation.detail}:id`}
                    element={<PrivateRoute element={<RecruitInformationDetail />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER]} />}
                />
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route path={routeNames.deliveryInformation.create} element={<DeliveryCreationPage />} />
                <Route
                    path={routeNames.deliveryInformation.management}
                    element={<PrivateRoute element={<DeliveryManagementPageAdmin />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER]} />}
                />
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route
                    path={routeNames.category.management}
                    element={<PrivateRoute element={<CategoryManagementAdminPage />} allowedRoles={[userRoles.ADMIN, userRoles.BRANCH_MANAGER]} />}
                />
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route path={routeNames.foodMenu.main} element={<FoodMenuMainPage />} />
                <Route path={routeNames.foodMenu.menu} element={<DetailedMenuPage />} />
                <Route path={`${routeNames.foodMenu.detailed.fromMain}:id`} element={<DetailedFoodPage />} />
                <Route path={`${routeNames.foodMenu.detailed.fromMenu}:id`} element={<DetailedFoodPage breadcrumb={'Categories'} />} />
                <Route path={routeNames.foodMenu.myCart} element={<MyCartPage />} />
                <Route path={routeNames.foodMenu.orderInfo} element={<OrderInformationPage />} />
                <Route path={routeNames.foodMenu.searchResult} element={<SearchResultPage />} />
                <Route path={routeNames.foodMenu.smsConfirm} element={<SMSConfirmPage />} />
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route path={routeNames.reservation.main} element={<ReservationPage />} />
                <Route path={routeNames.reservation.form} element={<ReservationForm />} />
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route path={routeNames.career.main} element={<CareerMainPage />} />
                <Route path={routeNames.career.findJobs} element={<FindJobsPage />} />
                <Route path={`${routeNames.career.detail}:id`} element={<JobOfferDetail />} />                
                {/* -------------------------------------------------------------------------------------------------------------------------- */}
                <Route
                    path={routeNames.jobOffer.management}
                    element={<PrivateRoute element={<JobOfferManagementPage />} allowedRoles={[userRoles.ADMIN]} />}
                />
                <Route
                    path={routeNames.jobOffer.create}
                    element={<PrivateRoute element={<CreateJobOffer />} allowedRoles={[userRoles.ADMIN]} />}
                />
                <Route
                    path={`${routeNames.jobOffer.edit}:id`}
                    element={<PrivateRoute element={<EditJobOffer />} allowedRoles={[userRoles.ADMIN]} />}
                />
                <Route
                    path={`${routeNames.jobOffer.detail}:id`}
                    element={<PrivateRoute element={<JobOfferDetailAdmin />} allowedRoles={[userRoles.ADMIN]} />}
                />

                <Route path={routeNames.login} element={<SignInPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </RoleLayout>
    );
};

export default AppRoutes;
