import { Row, Col, Carousel } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
// @ts-ignore
import loadingIcon from './../../../assets/LoadingIcon.png';
import { useMediaQuery } from "react-responsive";

const OriginalProduct = () => {
    const { t } = useTranslation('global');
    const isLargeScreen = useMediaQuery({ minWidth: 992 });

    // Sample product data
    const products = [
        { img: loadingIcon, title: t('originalProduct.products.product1') },
        { img: loadingIcon, title: t('originalProduct.products.product2') },
        { img: loadingIcon, title: t('originalProduct.products.product3') },
        { img: loadingIcon, title: t('originalProduct.products.product4') },
    ];

    return (
        <div style={{ padding: "50px 7vw", position: 'relative', zIndex: 1, backgroundColor: 'white' }}>
            <Row gutter={[16, 16]} style={{ padding: "50px 3vw" }}>
                <Col xs={24} lg={6} style={{ display: 'flex', alignItems: 'center' }}>
                    <h1 style={{
                        fontSize: isLargeScreen ? "4vw" : '8vw',
                        margin: 0,
                        width: '100%',
                        textAlign: isLargeScreen ? 'start' : 'center'
                    }}>
                        {t('originalProduct.title')}
                    </h1>
                </Col>
                <Col xs={24} lg={18} style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{
                        fontSize:isLargeScreen ?  "1.25vw" : '1rem',
                        lineHeight: "1.5",
                        margin: 0
                    }}>
                        {t('originalProduct.description')}
                    </p>
                </Col>
            </Row>

            {/* Rest of the component remains the same */}
            {isLargeScreen ? (
                <Row gutter={[16, 16]} justify="space-between">
                    {products.map((product, index) => (
                        <Col key={index} span={6}>
                            <div style={{ height: "40vh", textAlign: "left" }}>
                                <img
                                    src={product.img}
                                    alt={product.title}
                                    style={{
                                        width: "100%",
                                        height: "90%",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        border: '1px solid black'
                                    }}
                                />
                                <p style={{ fontSize: "1rem", marginTop: "0.5vh" }}>{product.title}</p>
                            </div>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Carousel>
                    {products.map((product, index) => (
                        <div key={index}>
                            <div style={{
                                height: "40rem",
                                textAlign: "center",
                                padding: "0 2rem"
                            }}>
                                <img
                                    src={product.img}
                                    alt={product.title}
                                    style={{
                                        width: "100%",
                                        height: "90%",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        border: '1px solid black'
                                    }}
                                />
                                <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>{product.title}</p>
                            </div>
                            <div style={{ height: '40px' }}></div>
                        </div>
                    ))}
                </Carousel>
            )}

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

export default OriginalProduct;