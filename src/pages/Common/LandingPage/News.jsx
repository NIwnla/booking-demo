import { Button, Col, Row } from "antd";
import React from "react";
import { useMediaQuery } from "react-responsive";
// @ts-ignore
import loadingIcon from './../../../assets/LoadingIcon.png';

const News = () => {
    const isLargeScreen = useMediaQuery({ minWidth: 992 });

    // Sample news data (11 news + 1 "View More" button)
    const newsItems = [
        { img: loadingIcon, date: "Jan 1, 2025", title: "News Title 1" },
        { img: loadingIcon, date: "Feb 5, 2025", title: "News Title 2" },
        { img: loadingIcon, date: "Mar 10, 2025", title: "News Title 3" },
        { img: loadingIcon, date: "Apr 15, 2025", title: "News Title 4" },
        { img: loadingIcon, date: "May 20, 2025", title: "News Title 5" },
        { img: loadingIcon, date: "Jun 25, 2025", title: "News Title 6" },
        { img: loadingIcon, date: "Jul 30, 2025", title: "News Title 7" },
        { img: loadingIcon, date: "Aug 10, 2025", title: "News Title 8" },
        { img: loadingIcon, date: "Sep 5, 2025", title: "News Title 9" },
        { img: loadingIcon, date: "Oct 12, 2025", title: "News Title 10" },
        { img: loadingIcon, date: "Nov 20, 2025", title: "News Title 11" },
    ];

    return (
        <div style={{ padding: "5vh 10vw", position: 'relative', zIndex: 1, backgroundColor: 'white', borderTop: "1px solid black" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "3vh", width: '100%', textAlign: 'center' }}>News</h1>
            <Row gutter={[16, 16]}>
                {newsItems.map((news, index) => (
                    <Col key={index} xs={24} lg={6}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: '16px' }}>
                            <img
                                src={news.img}
                                alt={news.title}
                                style={{
                                    width: isLargeScreen ? "40%" : '7rem',
                                    height: isLargeScreen ? "8vw" : '7rem',
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border: '1px solid black'
                                }}
                            />
                            <div style={{ marginLeft: "1vw" }}>
                                <p style={{ fontSize: isLargeScreen ? "0.8vw" : "1rem", margin: "0", color: "gray" }}>
                                    {news.date}
                                </p>
                                <p style={{ fontSize: isLargeScreen ? "1vw" : "1.5rem", fontWeight: "bold", margin: "0" }}>
                                    {news.title}
                                </p>
                            </div>
                        </div>
                    </Col>
                ))}
                <Col xs={24} lg={6}>
                    <div style={{
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: isLargeScreen ? 'flex-start' : 'center',
                        display: 'flex',
                        width: '100%'
                    }}>
                        <Button
                            shape="circle"
                            style={{
                                width: isLargeScreen ? "8vw" : '6rem',
                                height: isLargeScreen ? "4vw" : '4rem',
                                fontSize: isLargeScreen ? "1vw" : '1rem',
                                background: "red",
                                transition: "0.3s ease",
                                color: 'white'
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.background = "white", e.currentTarget.style.color = "red")}
                            onMouseOut={(e) => (e.currentTarget.style.background = "red", e.currentTarget.style.color = "white")}
                        >
                            View More
                        </Button>
                    </div>

                </Col>
            </Row>
        </div>
    );
};

export default News;
