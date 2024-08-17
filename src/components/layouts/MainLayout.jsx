import React, { useContext } from 'react';
import { Layout, Menu, Typography, Dropdown } from 'antd';
import { Link } from 'react-router-dom';
import { routeNames } from '../../constaints/routeName';
import { AuthContext } from '../../context/AuthContext';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const MainLayout = ({ children }) => {
    const { email, setRole, setEmail } = useContext(AuthContext);

    const handleLogout = () => {
        // Clear the auth context
        setRole(null);
        setEmail(null);
    };

    const menuItems = (
        <Menu>
            <Menu.Item key="logout" onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout>
            <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="logo" style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', marginRight: '2vw' }}>
                    My Restaurant
                </div>

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
                        <Menu.Item key="3">
                            <Link to="/contact">Contact</Link>
                        </Menu.Item>
                    </Menu>

                    {email ? (
                        <Dropdown
                            // @ts-ignore
                            menu={menuItems} placement="bottomRight" trigger={['click']}>
                            <Menu theme="dark" mode="horizontal" style={{ width: '15vw' }}>
                                <Menu.Item key="email">
                                    {email}
                                </Menu.Item>
                            </Menu>
                        </Dropdown>
                    ) : (
                        <Menu theme="dark" mode="horizontal" style={{ minWidth: '4vw' }}>
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

export default MainLayout;
