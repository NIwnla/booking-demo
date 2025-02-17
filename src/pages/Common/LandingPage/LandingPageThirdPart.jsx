import React, { useState } from "react";
import { Button, Col, Row, Typography } from "antd";

const { Title, Text } = Typography;

const images = [
    { id: 1, src: "image1.jpg", title: "MESSAGE FROM    FOUNDER" },
    { id: 2, src: "image2.jpg", title: "CHINA" },
    { id: 3, src: "image3.jpg", title: "JAPAN" },
    { id: 4, src: "image3.jpg", title: "VIETNAME" },
];

const LandingPageThirdPart = () => {
    const [topImage, setTopImage] = useState(images[0].id);

    const handleClick = (id) => {
        setTopImage(id);
    };



    return (
        <div
            style={{
                height: "80vh",
                backgroundColor: 'white',
                position: 'relative',
                zIndex: 1
            }}
        >
            <Row>
                <Col
                    span={6}
                    style={{
                        height: '80vh',
                        padding: '2vh 2vw',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                    <Title style={{ fontSize: "3vw", color: "#333" }}>
                        Library
                    </Title>
                    <Button
                        shape="round"
                        style={{ backgroundColor: 'red', color: 'white', height: '10vh', width: '8vw', fontSize: '1vw' }}>
                        <p style={{ margin: 0 }}>
                            View <br></br>
                            Library
                        </p>
                    </Button>
                </Col>
                <Col span={18} style={{ position: 'relative' }}>
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
                                    height: '80vh',
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
                                        width: '30vw',
                                        height: '50vh',
                                        backgroundColor: 'black',
                                    }}
                                />
                                <div style={{ width: '30vw' }}>
                                    {item.title}
                                </div>
                            </div>
                        );
                    })}



                </Col>
            </Row>

        </div>
    );
};

export default LandingPageThirdPart;
