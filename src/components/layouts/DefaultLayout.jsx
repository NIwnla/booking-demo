import { GlobalOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Drawer, Layout, Menu, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { routeNames } from '../../constaints/routeName';
import { changeLanguage } from '../../helpers/changeLanguage';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const DefaultLayout = ({ children }) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const { t, i18n } = useTranslation("global");
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const rightMenuItems = [
        {
            key: 'reservation',
            label: <Link to={routeNames.booking.branchChoose}>{t('header.reservation')}</Link>,
        },
        {
            key: 'delivery',
            label: <Link to={routeNames.foodMenu.main}>{t('header.delivery')}</Link>,
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
                    padding: '0 10vw'
                }}
            >
                <Link
                    to="/"
                    style={{ color: '#ffffff', fontSize: '1.25rem', textDecoration: 'none', margin: 0 }}
                >
                    {t('header.title')}
                </Link>
                {isLargeScreen ? (
                    <Menu
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
                ) : (
                    <Button
                        type="primary"
                        icon={<MenuOutlined />}
                        onClick={showDrawer}
                        style={{ background: 'transparent', border: 'none', color: '#fff', boxShadow: 'none' }}
                    />)}
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
                        background: '#eeeeee',
                        minHeight: '280px',
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
