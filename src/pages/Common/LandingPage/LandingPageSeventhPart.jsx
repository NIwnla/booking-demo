import { Row, Col } from "antd";
import React from "react";
// @ts-ignore
import loadingIcon from './../../../assets/LoadingIcon.png';

const LandingPageSeventhPart = () => {
    // Sample product data
    const products = [
        { img: loadingIcon, title: "Product 1" },
        { img: loadingIcon, title: "Product 2" },
        { img: loadingIcon, title: "Product 3" },
        { img: loadingIcon, title: "Product 4" },
    ];

    return (
        <div style={{ padding: "10vh 7vw", position: 'relative', zIndex: 1, backgroundColor: 'white' }}>
            {/* Title & Description */}
            <Row gutter={[16, 16]} style={{ padding: "3vh 3vw" }}>
                <Col span={8}>
                    <h1 style={{ fontSize: "2.5vw", margin: 0 }}>Original <br /> Products</h1>
                </Col>
                <Col span={16}>
                    <p style={{ fontSize: "1vw", lineHeight: "1.5" }}>
                        4P’s Originals are goods that offer a variety of products that are artisanal and high-quality foods,
                        prepared meals, as well as a selection of items produced by our like-minded business partners.
                        You can certainly "bring peace home" with 4P's Originals.
                    </p>
                </Col>
            </Row>

            {/* Product Grid */}
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
                                    border:'1px solid black'
                                }}
                            />
                            <p style={{ fontSize: "1vw", marginTop: "0.5vh" }}>{product.title}</p>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default LandingPageSeventhPart;
