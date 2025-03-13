import { CaretDownOutlined, DownOutlined } from '@ant-design/icons';
import { Carousel, Col, Dropdown, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const LocationAndMenu = () => {
    const { t } = useTranslation('global');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const locations = ["location1", "location2", "location3", "location4", "location5"];
    const items = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    {t('locationAndMenu.menu.location1')}
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    {t('locationAndMenu.menu.location2')}
                </a>
            ),
        },
        {
            key: '3',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    {t('locationAndMenu.menu.location3')}
                </a>
            ),
        }
    ];

    const carouselImages = [
        "https://via.placeholder.com/300x500",  // Replace with actual image URLs
        "https://via.placeholder.com/300x500",
        "https://via.placeholder.com/300x500",
    ];

    const handleLocationClick = (index) => {
        setSelectedLocation(index); // Store index of the clicked location
    };

    return (
        <div>
            <Row>
                <Col
                    xs={24} lg={12}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgb(48, 102, 202)',
                        height: '45rem',
                        width: '100%'
                    }}
                >
                    <Title style={{ paddingTop: '5vh', fontSize: '3rem', color: 'white' }}>
                        {t('locationAndMenu.title')}
                    </Title>

                    <div style={{
                        marginBottom: '3vh',
                        display: 'flex',
                        justifyContent: 'space-between',
                        minWidth: isLargeScreen ? '80%' : '90%',
                        paddingTop: '0.75rem',
                        position: 'relative',
                    }}>
                        {locations.map((location, index) => (
                            <div key={index} style={{ position: 'relative', textAlign: 'center' }}>
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleLocationClick(index)}
                                >
                                    {t(`locationAndMenu.locations.${location}`)}
                                </Text>

                                {selectedLocation === index && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-5vh',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '1.5rem',
                                        color: 'white',
                                    }}>
                                        <CaretDownOutlined />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>


                    {/* Dropdown without border */}
                    <div style={{ borderBottom: '2px solid white', minWidth: isLargeScreen ? '80%' : '90%', }}>
                        <Dropdown menu={{ items }} trigger={['click']}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1vh' }}>
                                <Text style={{ color: 'white', fontSize: '1rem', margin: 0 }}>Select location</Text>
                                <DownOutlined style={{ color: 'white', fontSize: '1.5rem' }} />
                            </div>
                        </Dropdown>
                    </div>

                    <div style={{
                        backgroundColor: 'white',
                        height: '100%',
                        width: '80%',
                        borderRadius: '8px',
                        margin: '10vh 0',
                        position: 'relative',
                        backgroundImage: 'url("https://via.placeholder.com/300")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}>
                        <a href="https://example.com"
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'black',
                                fontSize: '1.5rem',
                                padding: '0.5rem 1rem',
                                textDecoration: "underline"
                            }}>
                            Click Here
                        </a>
                    </div>

                </Col>
                <Col
                    xs={24} lg={12}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'rgb(204, 204, 204)',
                        height: '45rem',
                    }}>
                    <Title style={{ paddingTop: '5vh', fontSize: '3rem' }}>Menu</Title>
                    <div style={{
                        background: 'rgb(99, 99, 99)',
                        position: "relative",
                        height: "100%",
                        width: isLargeScreen ? '80%' : '90%',
                        borderRadius: "8px",
                        overflow: "hidden",
                        marginBottom: "10vh",
                    }}>
                        {/* Carousel */}
                        <Carousel autoplay dots={false} effect="fade">
                            {carouselImages.map((src, index) => (
                                <div key={index} style={{
                                    height: "80vh",
                                    width: "100%",
                                    backgroundImage: `url(${src})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }} />
                            ))}
                        </Carousel>

                        {/* Centered Link */}
                        <a href="/food-menu"
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                fontSize: "1.5rem",
                                color: "black",
                                backgroundColor: "rgb(255, 255, 255)", // Optional background for visibility
                                padding: "0.5rem 1rem",
                                borderRadius: "50px",
                                textDecoration: "underline"
                            }}>
                            View Menu
                        </a>
                    </div>
                </Col>

                <Col
                    span={24}
                    style={{
                        height: "50vh",
                        width: "100vw",
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: 'space-between',
                        alignItems: "flex-start",
                        textAlign: "left",
                        paddingLeft: '2vw'
                    }}
                >
                    {/* Top Content (Title + Description) */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}>
                        {/* Title */}
                        <Title style={{
                            fontSize: "3rem",
                            fontWeight: "bold",
                            marginBottom: "1vh",
                            color: "white"
                        }}>
                            {t('locationAndMenu.footer.title')}
                        </Title>

                        {/* Description */}
                        <Text style={{
                            fontSize: "1.5rem",
                            color: "white",
                            width: '60%'
                        }}>
                            {t('locationAndMenu.footer.description')}
                        </Text>
                    </div>

                    {/* View More Link (Positioned at the bottom) */}
                    <div>
                        <a href="/about-us" style={{ fontSize: "2rem", color: "white", textDecoration: "underline" }}>
                            {t('locationAndMenu.footer.viewMore')}
                        </a>
                    </div>
                </Col>

            </Row>
        </div>
    )
}

export default LocationAndMenu