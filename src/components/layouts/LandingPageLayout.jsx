import { Button, Dropdown, Layout, Menu, Typography } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Layout.css';
import { BookOutlined, GlobalOutlined, PhoneOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { changeLanguage } from '../../helpers/changeLanguage';
import { routeNames } from '../../constaints/routeName';


const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const LandingPageLayout = ({ children }) => {
    const navigate = useNavigate();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const { t, i18n } = useTranslation("global");

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#eeeeee' }}>
            {/* Header */}
            <Header
                style={{
                    width: '100vw',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'transparent',
                    padding: '5vh 2vw'
                }}
            >
                {/* Left - Title */}
                <Title level={3} style={{ margin: 0, cursor: 'pointer', color: 'White', fontSize: '2vw' }} onClick={() => navigate('/')}>
                    {t('header.title')}
                </Title>

                {/* Right - link and language */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3vw' }}>
                    <Text style={{ color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5vw', fontSize: '1.5vw' }} onClick={() => navigate(routeNames.booking.branchChoose)}>
                        <BookOutlined />
                        {t('header.reservation')}
                    </Text>
                    <Text style={{ color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5vw', fontSize: '1.5vw' }} onClick={() => navigate(routeNames.foodMenu.main)}>
                        <ShoppingCartOutlined />
                        {t('header.delivery')}
                    </Text>
                    <Text style={{ color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5vw', fontSize: '1.5vw' }} onClick={() => navigate(routeNames.recruitInformation.signUp)}>
                        <PhoneOutlined />
                        {t('header.career')}
                    </Text>
                    <Button
                        type="text"
                        icon={<GlobalOutlined />}
                        onClick={() => changeLanguage(i18n, i18n.language === "en" ? "vi" : "en")}
                        style={{
                            color: 'white',
                            fontSize: '1.5vw',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 0.5vw', // Reduce padding to match text height
                            height: 'auto', // Prevent button from increasing row height
                        }}
                    >
                        {i18n.language === "en" ? "VI" : "EN"}
                    </Button>
                </div>

            </Header>

            {/* Content */}
            <Content className="content-container" style={{ minHeight: 'calc(100vh - 133px)' }}>
                <div
                    style={{
                        background: '#ffffff'
                    }}
                >
                    {children}
                </div>
            </Content>

            {/* Footer */}
            <Footer style={{ textAlign: 'center', backgroundColor: '#ff0000', color: '#ffffff' }}>
                <Text style={{ color: '#ffffff' }}>{t('footer.copyright')}</Text>
            </Footer>
        </Layout>
    );
};

export default LandingPageLayout;
