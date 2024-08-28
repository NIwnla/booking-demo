import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import BranchManagerLayout from './BranchManagerLayout';
import DefaultLayout from './DefaultLayout';
import GuestLayout from './GuestLayout';
import { userRoles } from '../../constaints/userRoles';

const RoleLayout = ({ children }) => {
    const { role } = useContext(AuthContext);

    const renderLayout = () => {
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

    return renderLayout();
};

export default RoleLayout;
