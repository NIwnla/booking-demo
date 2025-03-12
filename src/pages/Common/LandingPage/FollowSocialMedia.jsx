import { LinkOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Col, Row, Typography, Carousel } from "antd";
import React, { useState, useEffect } from "react";

const { Title, Text } = Typography;

export default function FollowSocialMedia() {
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ width: "100%", padding: "50px 8vw", backgroundColor: "#f5f5f5", position: 'relative', zIndex: 1 }}>
            <Row gutter={[64, 64]}>
                <Col xs={24} lg={16} style={{ padding: "16px" }}>
                    <a style={{ fontSize: "2vw", marginBottom: "10px", color: 'black' }}>Follow <strong>Instagram</strong> <LinkOutlined /></a>
                    {isLargeScreen ? (
                        <Row gutter={[16, 16]}>
                            {[...Array(9)].map((_, index) => (
                                <Col span={8} key={index}>
                                    <div style={{ width: "100%", height: "15rem", backgroundColor: "#d9d9d9", borderRadius: "8px", textAlign: 'center' }}>{index}</div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Carousel >
                            {[...Array(9)].map((_, index) => (
                                <div key={index}>
                                    <div style={{ width: "100%", height: "30rem", backgroundColor: "#d9d9d9", textAlign: 'center' }}>{index}</div>
                                    <div style={{ height: '40px' }}></div>
                                </div>
                            ))}
                        </Carousel>
                    )}
                </Col>
                <Col xs={24} lg={8} style={{ padding: "16px" }}>
                    <a style={{ fontSize: "2vw", marginBottom: "10px", color: 'black' }}>Subscribe <strong>YouTube</strong> <LinkOutlined /></a>
                    {isLargeScreen ? (
                        <Row gutter={[16, 16]}>
                            {[...Array(3)].map((_, index) => (
                                <Col span={24} key={index}>
                                    <div style={{
                                        width: "100%",
                                        height: "15rem",
                                        backgroundColor: "#d9d9d9",
                                        borderRadius: "8px",
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <PlayCircleOutlined style={{ fontSize: '2rem', color: 'red' }} />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Carousel >
                            {[...Array(3)].map((_, index) => (
                                <div key={index}>
                                    <div style={{ width: "100%", height: "30rem", backgroundColor: "#d9d9d9", textAlign: 'center' }}>{index}</div>
                                    <div style={{ height: '40px' }}></div>
                                </div>

                            ))}
                        </Carousel>
                    )}
                </Col>
                <Col span={24} style={{ padding: "16px" }}>
                    <a style={{ fontSize: "2vw", marginBottom: "10px", color: 'black' }}>Follow <strong>Facebook</strong> <LinkOutlined /></a>
                    {isLargeScreen ? (
                        <Row gutter={[16, 16]}>
                            {[...Array(3)].map((_, index) => (
                                <Col span={8} key={index}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: 'lightblue' }}>
                                        <div style={{ width: "10rem", height: "10rem", backgroundColor: "#d9d9d9", borderRadius: "8px" }}></div>
                                        <Text style={{ fontSize: "1rem" }}>Facebook Post {index + 1}</Text>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Carousel>
                            {[...Array(3)].map((_, index) => (
                                <div key={index} style={{}}>
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: '16px' }}>
                                        <div style={{ width: "40%", height: "15rem", backgroundColor: "#d9d9d9", borderRadius: "8px" }}></div>
                                        <Text style={{ fontSize: "1rem" }}>Facebook Post {index + 1}</Text>
                                    </div>
                                    <div style={{ height: '40px' }}></div>
                                </div>
                            ))}
                        </Carousel>
                    )}
                </Col>
            </Row>

            <style>
                {`
                    .ant-carousel .slick-dots li button {
                        border: 1px solid black;
                    }
                    .ant-carousel .slick-dots li.slick-active button {
                        background: red !important;
                        border: 1px solid red;
                    }
                `}
            </style>
        </div>
    );
}
