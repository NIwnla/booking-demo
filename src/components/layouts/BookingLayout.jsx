import { MenuOutlined } from '@ant-design/icons';
import { Button, Drawer, Layout, Menu, Typography } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { routeNames } from '../../constaints/routeName';
import './Layout.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const BookingLayout = ({ children }) => {
    const [drawerVisible, setDrawerVisible] = useState(false);

    const rightMenuItems = [
        {
            key: 'menu',
            label: <Link to={routeNames.food.management}>Menu</Link>,
        },
        {
            key: 'reservation',
            label: <Link to={routeNames.booking.branchChoose}>Reservation</Link>,
        },
        {
            key: 'career',
            label: <Link to={routeNames.career}>Career</Link>,
        },
        {
            key: 'login',
            label: <Link to={routeNames.login}>Login</Link>,
        },
    ];

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    return (
        <Layout style={styles.layout}>
            {/* Header */}
            <Header style={styles.header}>
                {/* Restaurant Name as Link */}
                <Link to={routeNames.index} style={styles.headerTitle}>
                    Nollowa Chicken
                </Link>

                {/* Hamburger Button for Small Screens */}
                <Button
                    className="menu-toggle-button"
                    type="primary"
                    icon={<MenuOutlined />}
                    onClick={showDrawer}
                    style={styles.menuToggleButton}
                />

                {/* Right Menu Items */}
                <Menu
                    className='desktop-menu'
                    theme="light"
                    mode="horizontal"
                    style={styles.rightMenu}
                    items={rightMenuItems}
                />
            </Header>

            {/* Drawer for Small Screens */}
            <Drawer
                title={<Text style={{ color: '#ff0000' }}>My Restaurant</Text>}
                placement="top"
                closable={true}
                onClose={closeDrawer}
                open={drawerVisible}
                styles={{ body: { padding: 0, backgroundColor: '#ff0000' } }}
            >
                <Menu
                    theme="light"
                    mode="vertical"
                    onClick={closeDrawer}
                    style={{ backgroundColor: '#ff0000' }}
                    items={rightMenuItems}
                />
            </Drawer>

            {/* Content */}
            <Content className="content-container" style={styles.content}>
                <div style={styles.innerContent}>
                    {children}
                </div>
            </Content>

            {/* Footer */}
            <Footer
                // @ts-ignore
                style={styles.footer}>
                <Text style={styles.footerText}>My Restaurant ©2024 Created by Your Name</Text>
            </Footer>
        </Layout>
    );
};

export default BookingLayout;

// Styles
const styles = {
    layout: {
        minHeight: '100vh',
        backgroundColor: '#ffffff',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ff0000',
        padding: '0 20px',
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: '1.25rem',
        textDecoration: 'none',
        margin: 0,
    },
    menuToggleButton: {
        background: 'transparent',
        border: 'none',
        color: '#fff',
    },
    rightMenu: {
        display: 'flex',
        gap: '20px',
        color: '#ffffff',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
    },
    content: {
        minHeight: 'calc(100vh - 133px)',
    },
    innerContent: {
        background: '#ffffff',
        padding: '24px',
        minHeight: '280px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
    footer: {
        textAlign: 'center',
        backgroundColor: '#ff0000',
        color: '#ffffff',
    },
    footerText: {
        color: '#ffffff',
    },
};
