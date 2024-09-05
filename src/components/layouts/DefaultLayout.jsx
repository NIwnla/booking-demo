import { Dropdown, Layout, Menu, Space, Typography } from 'antd';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { routeNames } from '../../constaints/routeName';
import { AuthContext } from '../../context/AuthContext';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const DefaultLayout = ({ children }) => {
    const { email, clearAuthToken } = useContext(AuthContext);

    const handleLogout = () => {
        clearAuthToken();
    };

    const menuItems = [
        {
            key: 'logout',
            label: 'Logout',
            onClick: handleLogout,
        },
    ];

    return (
        <Layout>
            <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                <div style={{ color: '#000', fontSize: '20px', fontWeight: 'bold', marginRight: '2vw' }}>
                    My Restaurant
                </div>

                <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Menu
                        theme="light"
                        mode="horizontal"
                        style={{ display: 'flex', flex: 1 }}
                    >
                        <Menu.Item key="1">
                            <Link to={routeNames.index}>Home</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to={'2'}>About</Link>
                        </Menu.Item>
                    </Menu>

                    {email ? (
                        <Dropdown
                            menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}
                        >
                            <Space style={{ cursor: 'pointer', color: '#fff' }}>
                                {email}
                            </Space>
                        </Dropdown>
                    ) : (
                        <Menu theme="light" mode="horizontal" style={{ minWidth: '4vw' }}>
                            <Menu.Item key="signin">
                                <Link to={routeNames.login}>Sign In</Link>
                            </Menu.Item>
                        </Menu>
                    )}
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

export default DefaultLayout;
