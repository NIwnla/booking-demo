import { Button, Col, Layout, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BookOutlined, GlobalOutlined, MenuOutlined, PhoneOutlined, ShoppingCartOutlined, CloseOutlined, FacebookOutlined, InstagramOutlined, LinkedinOutlined, PinterestOutlined, YoutubeOutlined, YoutubeFilled, TwitterOutlined } from '@ant-design/icons';
import { changeLanguage } from '../../helpers/changeLanguage';
import { routeNames } from '../../constaints/routeName';
import './LandingPageLayout.css';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const LandingPageLayoutWhite = ({ children }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation("global");
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "auto";
        return () => { document.body.style.overflow = "auto"; };
    }, [menuOpen]);

    return (
        <Layout className="landing-page">
            {/* Header */}
            <Header className={`header ${menuOpen ? "header-open" : ""} scrolled-background`} >
                {/* Left - Title */}
                <Text className={`header-title ${menuOpen ? "header-title-open" : ""} scrolled-text`} onClick={() => navigate("/")}>
                    {t("header.title")}
                </Text>

                {/* Right - links & language toggle */}
                <div className="header-right">
                    <Text className={`nav-link ${menuOpen ? "nav-link-open" : ""} scrolled-text`} onClick={() => navigate(routeNames.reservation.main)}>
                        <BookOutlined /> {t("header.reservation")}
                    </Text>
                    <Text className={`nav-link ${menuOpen ? "nav-link-open" : ""} scrolled-text`} onClick={() => navigate(routeNames.foodMenu.main)}>
                        <ShoppingCartOutlined /> {t("header.delivery")}
                    </Text>
                    <Text className={`nav-link ${menuOpen ? "nav-link-open" : ""} scrolled-text`} onClick={() => navigate(routeNames.career.main)}>
                        <PhoneOutlined /> {t("header.career")}
                    </Text>
                    <Button
                        type="text"
                        icon={<GlobalOutlined />}
                        onClick={() => changeLanguage(i18n, i18n.language === "en" ? "vi" : "en")}
                        className={`language-button ${menuOpen ? "language-button-open" : ""} scrolled-text`}
                    >
                        {i18n.language === "en" ? "VI" : "EN"}
                    </Button>

                    {/* Menu button */}
                    <Button
                        type="text"
                        icon={menuOpen ? <CloseOutlined /> : <MenuOutlined />}
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`menu-button ${menuOpen ? "menu-button-open" : ""} scrolled-text`}
                    />
                </div>
            </Header>

            {/* Fullscreen Menu */}
            <div className={`menu-overlay ${menuOpen ? "menu-overlay-open" : ""}`}>
                <Row gutter={16} className="menu-container">
                    <Col span={8}>
                        <div className="column-container column-padding">
                            <p className="title-text">Location</p>
                            <p className="title-text">Menu</p>
                            <p className="title-text">Vision</p>
                            <p className="title-text">Sustainability</p>
                            <p className="title-text">Other Brand</p>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="column-container column-padding" style={{ paddingLeft: '0' }}>
                            <p className="title-text">Library</p>
                            <p className="title-text">Career</p>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="column-container column-padding">
                            <Text className="text column-padding-left">Company Profile</Text>
                            <Text className="text column-padding-left">Privacy Policy</Text>
                            <Text className="text column-padding-left">E-Invoice</Text>
                            <div className="column-padding-left" style={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
                                <Text className="follow-us-text">Follow Us!</Text>
                                <Row gutter={16}>
                                    <Col>
                                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                                            <YoutubeFilled className="social-icon youtube" />
                                        </a>
                                    </Col>
                                    <Col>
                                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                                            <InstagramOutlined className="social-icon instagram" />
                                        </a>
                                    </Col>
                                    <Col>
                                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                            <FacebookOutlined className="social-icon facebook" />
                                        </a>
                                    </Col>
                                    <Col>
                                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                                            <LinkedinOutlined className="social-icon linkedin" />
                                        </a>
                                    </Col>
                                    <Col>
                                        <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
                                            <PinterestOutlined className="social-icon pinterest" />
                                        </a>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Content */}
            <Content className={`content ${menuOpen ? "content-hidden" : ""}`}>
                {children}
            </Content>

            {/* Footer */}
            <Footer style={{ backgroundColor: 'red', color: "white", padding: "3vh 0", position: 'relative', zIndex: 1, }}>
                <Row align="middle">

                    <Col span={8}>
                        {/* Add content later */}
                    </Col>

                    <Col span={8} style={{ display: "flex", flexDirection: "column", gap: "0.8vh", alignItems: 'flex-end' }}>
                        <a href="/about" style={{ color: "white", fontSize: "1vw", textDecoration: "none" }}>About Us</a>
                        <a href="/careers" style={{ color: "white", fontSize: "1vw", textDecoration: "none" }}>Careers</a>
                        <a href="/contact" style={{ color: "white", fontSize: "1vw", textDecoration: "none" }}>Contact</a>
                        <a href="/privacy" style={{ color: "white", fontSize: "1vw", textDecoration: "none" }}>Privacy Policy</a>
                    </Col>

                    <Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingLeft: '4vw' }} >
                        <Text style={{ color: 'white', fontSize: '1.5vw' }}>Follow Us!</Text>
                        <div style={{ display: "flex", gap: "1vw" }}>
                            <YoutubeOutlined style={{ fontSize: "2vw", cursor: "pointer" }} />
                            <InstagramOutlined style={{ fontSize: "2vw", cursor: "pointer" }} />
                            <FacebookOutlined style={{ fontSize: "2vw", cursor: "pointer" }} />
                            <LinkedinOutlined style={{ fontSize: "2vw", cursor: "pointer" }} />
                            <PinterestOutlined style={{ fontSize: "2vw", cursor: "pointer" }} />
                        </div>
                    </Col>
                </Row>

                {/* Copyright Text */}
                <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: "center", marginTop: "2vh", padding: '0 2vw' }}>
                    <div>
                        <Text style={{ color: "white", fontSize: "0.9vw", paddingRight: '5vw' }}>For Inquiry</Text>
                        <Text style={{ color: "white", fontSize: "0.9vw" }}>For FeedBack</Text>
                    </div>
                    <Text style={{ color: "white", fontSize: "0.9vw" }}>{t("footer.copyright")}</Text>
                </div>
            </Footer>
        </Layout>
    );
};

export default LandingPageLayoutWhite;
