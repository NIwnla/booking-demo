import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { routeNames } from '../../constaints/routeName';
import { userRoles } from '../../constaints/userRoles';
import { AuthContext } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import BranchManagerLayout from './BranchManagerLayout';
import DefaultLayout from './DefaultLayout';
import GuestLayout from './GuestLayout';
import LandingPageLayout from './LandingPageLayout';
import { Spin } from 'antd';
import LandingPageLayoutWhite from './LandingPageLayoutWhite';

const RoleLayout = ({ children }) => {
    const { role } = useContext(AuthContext);
    const location = useLocation(); // Get the current URL path


    // If the current route is the home page, use LandingPageLayout
    if (location.pathname === routeNames.index || location.pathname === routeNames.career.main) {
        return <LandingPageLayout>{children}</LandingPageLayout>;
    }

    if (location.pathname.includes(routeNames.career.main)) {
        return <LandingPageLayoutWhite>{children}</LandingPageLayoutWhite>;
    }

    // Otherwise, use the role-based layout
    switch (role) {
        case userRoles.ADMIN:
            return <AdminLayout>{children}</AdminLayout>;
        case userRoles.BRANCH_MANAGER:
            return <BranchManagerLayout>{children}</BranchManagerLayout>;
        case userRoles.GUEST:
            return <GuestLayout>{children}</GuestLayout>;
        default:
            return <DefaultLayout>{children}</DefaultLayout>;
    }
};

export default RoleLayout;
