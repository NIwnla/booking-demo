import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { routeNames } from '../../constaints/routeName';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const MainLayout = ({ children }) => {
    return (
        <Layout>
            <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo */}
                <div className="logo" style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', marginRight: '2vw' }}>
                    My Restaurant
                </div>

                {/* Main Menu */}
                <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        style={{ display: 'flex', flex: 1 }}
                    >
                        <Menu.Item key="1">
                            <Link to={routeNames.index}>Home</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to={routeNames.booking.bookingPage}>Booking</Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/contact">Contact</Link>
                        </Menu.Item>
                    </Menu>

                    {/* Sign In Menu Item */}
                    <Menu theme="dark" mode="horizontal" style={{minWidth: '4vw'}}>
                        <Menu.Item key="signin">
                            <Link to={routeNames.login}>Sign In</Link>
                        </Menu.Item>
                    </Menu>
                </div>
            </Header>

            <Content style={{ padding: '50px', minHeight: 'calc(100vh - 133px)' }}>
                <div style={{ background: '#fff', padding: '24px', minHeight: '280px' }}>
                    {children}
                </div>
            </Content>

            <Footer style={{ textAlign: 'center' }}>
                <Text>My Restaurant ©2024 Created by Your Name</Text>
            </Footer>
        </Layout>
    );
};

export default MainLayout;
