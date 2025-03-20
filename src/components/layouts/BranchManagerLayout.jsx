import { GlobalOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Drawer, Dropdown, Layout, Menu, Space, Typography } from 'antd';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routeNames } from '../../constaints/routeName';
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../helpers/changeLanguage';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const BranchManagerLayout = ({ children }) => {
    const { email, clearAuthToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const {t,i18n} = useTranslation('global');

    const handleLogout = () => {
        clearAuthToken();
        navigate(routeNames.index);
    };

    const rightMenuItems = [
        {
            key: 'Profile',
            label: 'Profile',
            onClick: () => navigate(routeNames.user.information),
        },
        {
            key: 'language',
            label: (
                <span>
                    <GlobalOutlined style={{ marginRight: 8 }} />
                    {t('header.language')}
                </span>
            ),
            children: [
                {
                    key: 'english',
                    label: 'English',
                    onClick: () => changeLanguage(i18n, 'en'),
                },
                {
                    key: 'vietnamese',
                    label: 'Tiếng Việt',
                    onClick: () => changeLanguage(i18n, 'vi'),
                },
            ],
        },
        {
            key: 'logout',
            label: t('header.logout'),
            onClick: handleLogout,
        },
    ];

    const leftMenuItems = [
        {
            key: '1',
            label: <Link to={routeNames.index}>Home</Link>,
        },
        {
            key: '2',
            label: <Link to={routeNames.booking.branchChoose}>Booking</Link>,
        },
        {
            key: '3',
            label: <Link to={routeNames.booking.management}>Management</Link>,
        },
        {
            key: '4',
            label: <Link to={routeNames.disableTime.branchChoose}>Disable booking time</Link>,
        },
        {
            key: '5',
            label: <Link to={routeNames.food.management}>Foods</Link>,
        },
    ];

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
            {/* Header */}

            <Header
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#ff0000',
                    padding: '0 10vw',
                }}
            >
                {/* Restaurant Name */}
                <Title className="header-title" level={4} style={{ color: '#ffffff', margin: 6 }}>
                    My Restaurant
                </Title>

                {/* Hamburger Button for Small Screens */}
                <Button
                    className="menu-toggle-button"
                    type="primary"
                    icon={<MenuOutlined />}
                    onClick={showDrawer}
                    style={{ display: 'none', background: 'transparent', color: '#fff', border: 'none', marginBottom: '4vh' }}
                />

                {/* Horizontal Menu for Large Screens */}
                <Menu
                    theme='light'
                    mode="horizontal"
                    style={{
                        display: 'flex',
                        flex: 1,

                        color: '#ffffff',
                        justifyContent: 'flex-start',
                    }}
                    className="desktop-menu"
                    items={leftMenuItems}
                />


                {/* Dropdown for Logged-in User */}
                {email ? (
                    <Dropdown
                        menu={{ items: rightMenuItems }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Space style={{ cursor: 'pointer' }}>
                            <Text style={{ color: '#ffffff' }}>{email}</Text>
                        </Space>
                    </Dropdown>
                ) : (
                    <Link to={routeNames.login} style={{ textDecoration: 'none', color: '#ffffff' }} >
                        Sign In
                    </Link>
                )}
            </Header>

            {/* Drawer for Small Screens */}
            <Drawer
                title={<Text style={{ color: '#ff0000' }}> My Restaurant</Text>}
                placement="top"
                closable={true}
                onClose={closeDrawer}
                open={drawerVisible}
                styles={{
                    body: {
                        padding: 0, backgroundColor: '#ff0000'
                    }
                }}


            >
                <Menu
                    theme='light'
                    mode="vertical"
                    onClick={closeDrawer}
                    style={{ backgroundColor: '#ff0000' }}
                    items={leftMenuItems}
                >
                </Menu>
            </Drawer>

            {/* Content */}
            <Content className='content-container' style={{ minHeight: 'calc(100vh - 133px)' }}>
                <div
                    style={{
                        background: '#ffffff',
                        minHeight: '280px',
                    }}
                >
                    {children}
                </div>
            </Content>

            {/* Footer */}
            <Footer style={{ textAlign: 'center', backgroundColor: '#ff0000', color: '#ffffff' }}>
                <Text style={{ color: '#ffffff' }}>My Restaurant ©2024 Created by Your Name</Text>
            </Footer>
        </Layout>
    );
};

export default BranchManagerLayout;
