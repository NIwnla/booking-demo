import { Button, Col, Row, Typography, Carousel } from "antd";  // Add Carousel import
import React, { useEffect, useState } from "react";

const { Title } = Typography;

const images = [
    { id: 1, src: "image1.jpg", title: "MESSAGE FROM    FOUNDER" },
    { id: 2, src: "image2.jpg", title: "CHINA" },
    { id: 3, src: "image3.jpg", title: "JAPAN" },
    { id: 4, src: "image3.jpg", title: "VIETNAME" },
];

const Library = () => {
    const [topImage, setTopImage] = useState(images[0].id);

    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClick = (id) => {
        setTopImage(id);
    };



    return (
        <div style={{ minHeight: "40rem", backgroundColor: 'rgb(241, 241, 241)', position: 'relative', zIndex: 1 }}>
            <Row>
                <Col xs={24} lg={6} style={{
                    minHeight: '40rem',
                    padding: '50px 3vw',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <Title style={{ fontSize: "3rem", color: "#333", textAlign: isLargeScreen ? 'start' : 'center' }}>
                            Library
                        </Title>
                        {!isLargeScreen && (
                            <Carousel
                                effect="scrollx"
                                style={{ width: '100%', margin: '2rem 0' }}
                                arrows={true}
                            >
                                {images.map((image, index) => (
                                    <div key={index}>
                                        <div style={{
                                            height: '800px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                        }}>
                                            <img
                                                src={image.src}
                                                alt={image.title}
                                                style={{
                                                    background: '#000',
                                                    width: '100%',
                                                    height: '90%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </Carousel>)}
                    </div>
                    <Button
                        shape="round"
                        style={{
                            padding: '5px',
                            margin: isLargeScreen ? '0' : '0 auto',
                            backgroundColor: 'red',
                            color: 'white',
                            height: '5rem',
                            width: '8rem',
                            fontSize: '1rem',
                            transition: 'background-color 0.3s ease, color 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = 'red';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'red';
                            e.currentTarget.style.color = 'white';
                        }}
                    >
                        <p style={{ margin: 0 }}>
                            View <br />
                            Library
                        </p>
                    </Button>
                </Col>
                {isLargeScreen &&
                    <Col span={18} style={{ position: 'relative', height: '40rem', display: isLargeScreen ? 'block' : 'none' }}>
                        {images.map((item, index) => {
                            const distance = Math.abs(topImage - item.id); // Calculate the absolute distance between topImage and the current item
                            const zIndexValue = Math.max(1, 10 - distance); // Set the z-index based on the distance (make sure it doesn't go below 1)

                            return (
                                <div
                                    key={index}
                                    onClick={() => handleClick(item.id)}
                                    style={{
                                        position: 'absolute',
                                        left: `${(16.67 * index)}%`,
                                        height: '100%',
                                        width: '50%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#f0f0f0',
                                        borderLeft: '1px solid black',
                                        borderRight: '1px solid black',
                                        zIndex: zIndexValue, // Set z-index based on distance
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '80%',
                                            height: '70%',
                                            backgroundColor: 'black',
                                        }}
                                    />
                                    <div style={{ width: '80%' }}>
                                        {item.title}
                                    </div>
                                </div>
                            );
                        })}
                    </Col>}
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
};

export default Library;
