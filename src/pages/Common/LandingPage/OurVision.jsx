import React from "react";
import { Row, Col, Button } from "antd";
import { useTranslation } from 'react-i18next';
// @ts-ignore
import video from "../../../assets/LandingPageVideo2.mp4";
import { useMediaQuery } from "react-responsive";

const OurVision = () => {
    const { t } = useTranslation('global');
    const isLargeScreen = useMediaQuery({ minWidth: 992 });

    return (
        <div style={{ backgroundColor: 'white' }}>
            {/* Vision Section */}
            <Row justify="space-between" align="middle" >
                <Col span={24} style={{ backgroundColor: 'rgb(56, 85, 214)', display: "flex", flexDirection: 'column', alignItems: 'center', color: 'white' }}>
                    <p style={{ fontSize: "1rem", marginTop: '5vh', fontWeight: 'bold' }}>
                        {t('ourVision.title')}
                    </p>
                    <h1 style={{ fontSize: isLargeScreen ? "5vw" : '15vw', margin: 0, display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                        {t('ourVision.mainHeading')}
                        <Button
                            shape="circle"
                            style={{
                                display:isLargeScreen ? "block": 'none',
                                border: 'none',
                                width: "8vw",
                                height: "6vw",
                                backgroundColor: "white",
                                fontSize: "1.5vw",
                                marginLeft: '2vw',
                                color: 'red',
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'red';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.color = 'red';
                            }}
                        >
                            <p style={{ margin: 0, fontWeight: 'bold' }}>
                                {t('ourVision.buttons.viewMore').split(' ').map((word, index) => (
                                    <React.Fragment key={index}>
                                        {word}
                                        {index === 0 && <br />}
                                    </React.Fragment>
                                ))}
                            </p>
                        </Button>
                    </h1>
                    {!isLargeScreen && 
                        <Button
                            shape="circle"
                            style={{
                                border: 'none',
                                width: "6rem",
                                height: "4rem",
                                backgroundColor: "white",
                                fontSize: "1rem",
                                marginBottom: '10px',
                                color: 'red',
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'red';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.color = 'red';
                            }}
                        >
                            <p style={{ margin: 0, fontWeight: 'bold' }}>
                                {t('ourVision.buttons.viewMore').split(' ').map((word, index) => (
                                    <React.Fragment key={index}>
                                        {word}
                                        {index === 0 && <br />}
                                    </React.Fragment>
                                ))}
                            </p>
                        </Button>}
                </Col>
                <Col xs={24} lg={14} style={{ height: isLargeScreen ? '40rem' : '10rem' }}>
                    <video style={{ width: "100%", height: "100%", objectFit: 'cover' }} autoPlay muted playsInline loop>
                        <source src={video} type="video/mp4" />
                    </video>
                </Col>
                <Col xs={24} lg={10} style={{ height: isLargeScreen ? '40rem' : '25rem' }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        backgroundColor: 'rgb(226, 62, 62)',
                        height: '100%'
                    }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '3rem', color: 'white', padding: '3vh 2vw' }}>
                                {t('ourVision.joinSection.title')}
                            </h2>
                            <p style={{ margin: 0, fontSize: '1.5rem', color: 'white', padding: '0 5vw 0 2vw' }}>
                                {t('ourVision.joinSection.description')}
                            </p>
                        </div>
                        <div>
                            <Button
                                shape="circle"
                                style={{
                                    border: 'none',
                                    width: isLargeScreen ? "12vw": '8rem', 
                                    height: isLargeScreen ? "7vw" : '4rem',
                                    margin: '5vh 3vw',
                                    backgroundColor: "white",
                                    fontSize: isLargeScreen ? "2vw" : '1rem',
                                    marginLeft: '2vw',
                                    color: 'blue',
                                    transition: 'background-color 0.3s ease, color 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'blue';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.color = 'blue';
                                }}
                            >
                                <p style={{ margin: 0, fontWeight: "bold" }}>
                                    {t('ourVision.buttons.viewMore').split(' ').map((word, index) => (
                                        <React.Fragment key={index}>
                                            {word}
                                            {index === 0 && <br />}
                                        </React.Fragment>
                                    ))}
                                </p>
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default OurVision;
