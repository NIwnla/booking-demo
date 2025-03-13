import React from "react";
import { Row, Col, Button } from "antd";
import { useTranslation } from 'react-i18next';
// @ts-ignore
import video from "../../../assets/LandingPageVideo2.mp4";

const OurVision = () => {
    const { t } = useTranslation('global');

    return (
        <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'white' }}>
            {/* Vision Section */}
            <Row justify="space-between" align="middle" >
                <Col span={24} style={{ backgroundColor: 'rgb(56, 85, 214)', display: "flex", flexDirection: 'column', alignItems: 'center', color: 'white' }}>
                    <p style={{ fontSize: "1rem", marginTop: '5vh', fontWeight: 'bold' }}>
                        {t('ourVision.title')}
                    </p>
                    <h1 style={{ fontSize: "5vw", margin: 0, display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                        {t('ourVision.mainHeading')}
                        <Button
                            shape="circle"
                            style={{
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
                </Col>
                <Col xs={24} lg={14} style={{ height: '40vw' }}>
                    <video style={{ width: "100%", height: "100%", objectFit: 'cover' }} autoPlay muted playsInline loop>
                        <source src={video} type="video/mp4" />
                    </video>
                </Col>
                <Col xs={24} lg={10} style={{ height: '40vw' }}>
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
                                    width: "12vw",
                                    height: "7vw",
                                    margin: '5vh 3vw',
                                    backgroundColor: "white",
                                    fontSize: "2vw",
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
