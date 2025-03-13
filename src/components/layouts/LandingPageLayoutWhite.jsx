import { BookOutlined, CloseOutlined, FacebookOutlined, GlobalOutlined, InstagramOutlined, LinkedinOutlined, MenuOutlined, PhoneOutlined, PinterestOutlined, ShoppingCartOutlined, YoutubeFilled, YoutubeOutlined } from '@ant-design/icons';
import { Button, Col, Layout, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { routeNames } from '../../constaints/routeName';
import { changeLanguage } from '../../helpers/changeLanguage';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const LandingPageLayoutWhite = ({ children }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation("global");
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "auto";
        return () => { document.body.style.overflow = "auto"; };
    }, [menuOpen]);


    // Function to handle scroll event
    const handleScroll = () => {
        if (window.scrollY >= window.innerHeight) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#ffffff', }}>
            {/* Header */}
            <Header style={{
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                transition: 'background 0.3s ease, background-color 0.3s ease',
                padding: '30px 2vw'
            }}>
                <Text style={{
                    margin: 0,
                    cursor: 'pointer',
                    color: 'black',
                    fontSize: '2rem',
                    transition: 'color 0.3s ease',
                    fontWeight: 'bold'
                }} onClick={() => navigate("/")}>
                    {t("header.title")}
                </Text>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3vw'
                }}>
                    {isLargeScreen && (<>
                        <Text style={{
                            color: 'black',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1.5rem',
                            transition: 'color 0.3s ease'
                        }} onClick={() => navigate(routeNames.reservation.main)}>
                            <BookOutlined /> {t("header.reservation")}
                        </Text>
                        <Text style={{
                            color: 'black',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1.5rem',
                            transition: 'color 0.3s ease'
                        }} onClick={() => navigate(routeNames.foodMenu.main)}>
                            <ShoppingCartOutlined /> {t("header.delivery")}
                        </Text>
                        <Text style={{
                            color: 'black',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1.5rem',
                            transition: 'color 0.3s ease'
                        }} onClick={() => navigate(routeNames.career.main)}>
                            <PhoneOutlined /> {t("header.career")}
                        </Text>
                    </>)}
                    <Button
                        type="text"
                        icon={<GlobalOutlined />}
                        onClick={() => changeLanguage(i18n, i18n.language === "en" ? "vi" : "en")}
                        style={{
                            color: 'black',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 0.5vw',
                            height: 'auto',
                            transition: 'color 0.3s ease'
                        }}
                    >
                        {i18n.language === "en" ? "VI" : "EN"}
                    </Button>

                    <Button
                        type="text"
                        icon={menuOpen ? <CloseOutlined /> : <MenuOutlined />}
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            color: 'black',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 0.5vw',
                            height: 'auto',
                            transition: 'color 0.3s ease'
                        }}
                    />
                </div>

            </Header>



            <div style={{
                position: 'fixed',
                top: 100,
                left: 0,
                height: 'calc(100vh - 100px)', // Adjust height to account for header
                width: '100vw',
                display: 'block',  // Changed from flex to block
                backgroundColor: 'white',
                opacity: menuOpen ? 1 : 0,
                visibility: menuOpen ? 'visible' : 'hidden',
                transition: 'opacity 0.3s ease, visibility 0.3s ease',
                overflowY: 'auto',
                overflowX: 'hidden'
            }}>
                <Row gutter={16} style={{
                    width: '100%',
                    minHeight: '100%',
                    margin: 0,
                    padding: '2rem 0'
                }}>
                    <Col xs={24} lg={8}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            height: '100%',
                            gap: '0.75rem',
                            paddingLeft: '6vw',
                            paddingBottom: '10vh',
                        }}>
                            <p style={{ fontSize: '2rem', textAlign: 'left', fontWeight: 500, margin: 0 }}>Location</p>
                            <p style={{ fontSize: '2rem', textAlign: 'left', fontWeight: 500, margin: 0 }}>Menu</p>
                            <p style={{ fontSize: '2rem', textAlign: 'left', fontWeight: 500, margin: 0 }}>Vision</p>
                            <p style={{ fontSize: '2rem', textAlign: 'left', fontWeight: 500, margin: 0 }}>Sustainability</p>
                            <p style={{ fontSize: '2rem', textAlign: 'left', fontWeight: 500, margin: 0 }}>Other Brand</p>
                        </div>
                    </Col>
                    <Col xs={24} lg={8}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: menuOpen ? 'flex-end' : 'flex-start',
                            height: '100%',
                            gap: '0.75rem',
                            paddingLeft: '6vw',
                            paddingBottom: '10vh'
                        }}>
                            <p style={{ fontSize: '2rem', textAlign: 'left', fontWeight: 500, margin: 0 }}>Library</p>
                            <p style={{ fontSize: '2rem', textAlign: 'left', fontWeight: 500, margin: 0 }}>Career</p>
                        </div>
                    </Col>
                    <Col xs={24} lg={8}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            height: '100%',
                            gap: '0.75rem',
                            paddingLeft: '6vw',
                            paddingBottom: '10vh'
                        }}>
                            <Text style={{ fontSize: '1rem', textAlign: 'left', margin: 0 }}>Company Profile</Text>
                            <Text style={{ fontSize: '1rem', textAlign: 'left', margin: 0 }}>Privacy Policy</Text>
                            <Text style={{ fontSize: '1rem', textAlign: 'left', margin: 0 }}>E-Invoice</Text>
                            <div style={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
                                <Text style={{ fontSize: '1.5rem', textAlign: 'left' }}>Follow Us!</Text>
                                <Row gutter={16}>
                                    <Col>
                                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                                            <YoutubeFilled style={{ fontSize: '1.75rem', marginRight: '10px', color: 'red' }} />
                                        </a>
                                    </Col>
                                    <Col>
                                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                                            <InstagramOutlined style={{ fontSize: '1.75rem', marginRight: '10px', color: 'brown' }} />
                                        </a>
                                    </Col>
                                    <Col>
                                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                            <FacebookOutlined style={{ fontSize: '1.75rem', marginRight: '10px', color: 'blue' }} />
                                        </a>
                                    </Col>
                                    <Col>
                                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                                            <LinkedinOutlined style={{ fontSize: '1.75rem', marginRight: '10px', color: 'rgba(45, 8, 255, 0.8)' }} />
                                        </a>
                                    </Col>
                                    <Col>
                                        <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
                                            <PinterestOutlined style={{ fontSize: '1.75rem', marginRight: '10px', color: 'red' }} />
                                        </a>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            <Content style={{
                background: '#ffffff',
                transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
                opacity: menuOpen ? 0 : 1,
                visibility: menuOpen ? 'hidden' : 'visible'
            }}>
                {children}
            </Content>

            {/* Mobile Bottom Navigation */}
            {!isLargeScreen && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    backgroundColor: 'white',
                    padding: '15px 0',
                    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000
                }}>
                    <Row justify="space-around" align="middle">
                        <Col span={8} style={{ textAlign: 'center' }}>
                            <Text
                                onClick={() => navigate(routeNames.reservation.main)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <BookOutlined style={{ fontSize: '1.5rem' }} />
                                {t("header.reservation")}
                            </Text>
                        </Col>
                        <Col span={8} style={{ textAlign: 'center' }}>
                            <Text
                                onClick={() => navigate(routeNames.foodMenu.main)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <ShoppingCartOutlined style={{ fontSize: '1.5rem' }} />
                                {t("header.delivery")}
                            </Text>
                        </Col>
                        <Col span={8} style={{ textAlign: 'center' }}>
                            <Text
                                onClick={() => navigate(routeNames.career.main)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <PhoneOutlined style={{ fontSize: '1.5rem' }} />
                                {t("header.career")}
                            </Text>
                        </Col>
                    </Row>
                </div>
            )}

            {/* Footer */}
            <Footer style={{
                backgroundColor: 'red',
                color: "white",
                padding: "2rem 0",
                paddingBottom: isLargeScreen ? '1rem' : '85px',
                position: 'relative',
                zIndex: 1,
            }}>
                <Row align="middle">
                    <Col xs={24} lg={10}>
                        {/* Add content later */}
                    </Col>

                    <Col xs={24} lg={6} style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: 'flex-start', paddingLeft: '2vw' }}>
                        <a href="/about" style={{ color: "white", fontSize: "1.25rem", textDecoration: "none" }}>
                            Company Profile
                        </a>
                        <a href="/careers" style={{ color: "white", fontSize: "1.25rem", textDecoration: "none" }}>
                            Privacy Policy
                        </a>
                        <a href="/contact" style={{ color: "white", fontSize: "1.25rem", textDecoration: "none" }}>
                            Career
                        </a>
                        <a href="/privacy" style={{ color: "white", fontSize: "1.25rem", textDecoration: "none" }}>
                            E-Invoice
                        </a>
                    </Col>

                    <Col xs={24} lg={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '16px 2vw' }} >
                        <Text style={{ color: 'white', fontSize: '1.5rem' }}>Follow Us!</Text>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <YoutubeOutlined style={{ fontSize: "2rem", cursor: "pointer" }} />
                            <InstagramOutlined style={{ fontSize: "2rem", cursor: "pointer" }} />
                            <FacebookOutlined style={{ fontSize: "2rem", cursor: "pointer" }} />
                            <LinkedinOutlined style={{ fontSize: "2rem", cursor: "pointer" }} />
                            <PinterestOutlined style={{ fontSize: "2rem", cursor: "pointer" }} />
                        </div>
                    </Col>
                </Row>

                {/* Copyright Text */}
                <div style={{
                    display: 'flex',
                    flexDirection: isLargeScreen ? 'row' : 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    textAlign: "start",
                    marginTop: "16px",
                    padding: '0 2vw',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <Text style={{ color: "white", fontSize: "0.9rem", paddingRight: '5vw' }}>
                            For Inquiry {isLargeScreen ? "\u00A0\u00A0\u00A0" : (<br />)}
                            <a style={{ color: 'white' }}>email@nollowaChicken.com</a>
                        </Text>
                        <Text style={{ color: "white", fontSize: "0.9rem" }}>
                            For FeedBack {isLargeScreen ? "\u00A0\u00A0\u00A0" : (<br />)}
                            <a style={{ color: 'white' }}>email@nollowaChicken.com</a>
                        </Text>
                    </div>
                    <Text style={{ color: "white", fontSize: "0.9rem" }}>{t("footer.copyright")}</Text>
                </div>
            </Footer>
        </Layout >
    );
};

export default LandingPageLayoutWhite;
