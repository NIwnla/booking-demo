import { GlobalOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Drawer, Layout, Menu, Typography } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Layout.css';
import { routeNames } from '../../constaints/routeName';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const DefaultLayout = ({ children }) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const { t, i18n } = useTranslation("global");

    const rightMenuItems = [
        {
            key: 'menu',
            label: <Link to={routeNames.food.management}>{t('header.menu')}</Link>,
        },
        {
            key: 'reservation',
            label: <Link to={routeNames.booking.branchChoose}>{t('header.reservation')}</Link>,
        },
        {
            key: 'delivery',
            label: <Link to={routeNames.deliveryInformation.create}>{t('header.delivery')}</Link>,
        },
        {
            key: 'career',
            label: <Link to={routeNames.recruitInformation.signUp}>{t('header.career')}</Link>,
        },
        {
            key: 'language',
            label: (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <GlobalOutlined style={{ fontSize: '1.5rem', marginRight: 8 }} />
                    {t('header.language')}
                </span>
            ),
            children: [
                {
                    key: 'english',
                    label: 'English',
                    onclick: () => i18n.changeLanguage('en')
                },
                {
                    key: 'vietnamese',
                    label: 'Tiếng Việt',
                    onclick: () => i18n.changeLanguage('vi')
                },
            ],
        },
        {
            key: 'login',
            label: <Link to={routeNames.login}>{t('header.login')}</Link>,
        },
    ];


    const showDrawer = () => setDrawerVisible(true);
    const closeDrawer = () => setDrawerVisible(false);

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
            <Header
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#ff0000',
                    padding: '0 20px'
                }}
            >
                <Link
                    to="/"
                    style={{ color: '#ffffff', fontSize: '1.25rem', textDecoration: 'none', margin: 0 }}
                >
                    {t('header.title')}
                </Link>
                <Button
                    className="menu-toggle-button"
                    type="primary"
                    icon={<MenuOutlined />}
                    onClick={showDrawer}
                    style={{ background: 'transparent', border: 'none', color: '#fff' }}
                />
                <Menu
                    className="desktop-menu"
                    theme="light"
                    mode="horizontal"
                    style={{
                        display: 'flex',
                        gap: '20px',
                        color: '#ffffff',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        flex: 1
                    }}
                    items={rightMenuItems}
                />
            </Header>

            <Drawer
                title={<Text style={{ color: '#ff0000' }}>{t('drawer.title')}</Text>}
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

            <Content className="content-container" style={{ minHeight: 'calc(100vh - 133px)' }}>
                <div
                    style={{
                        background: '#ffffff',
                        padding: '24px',
                        minHeight: '280px',
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                    }}
                >
                    {children}
                </div>
            </Content>

            <Footer
                style={{
                    textAlign: 'center',
                    backgroundColor: '#ff0000',
                    color: '#ffffff'
                }}
            >
                <Text style={{ color: '#ffffff' }}>{t('footer.copyright')}</Text>
            </Footer>
        </Layout>
    );
};

export default DefaultLayout;
