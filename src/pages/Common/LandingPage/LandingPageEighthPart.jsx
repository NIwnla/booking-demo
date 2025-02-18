import { Row, Col, Button } from "antd";
import React from "react";
// @ts-ignore
import loadingIcon from './../../../assets/LoadingIcon.png';

const LandingPageEighthPart = () => {
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
            {/* News Title */}
            <h1 style={{ fontSize: "3vw", marginBottom: "3vh" }}>News</h1>

            {/* News Grid */}
            <Row gutter={[16, 16]}>
                {newsItems.map((news, index) => (
                    <Col key={index} span={6}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {/* Image */}
                            <img
                                src={news.img}
                                alt={news.title}
                                style={{ width: "40%", height: "8vw", objectFit: "cover", borderRadius: "8px" }}
                            />

                            {/* Text */}
                            <div style={{ marginLeft: "1vw" }}>
                                <p style={{ fontSize: "0.8vw", margin: "0", color: "gray" }}>{news.date}</p>
                                <p style={{ fontSize: "1vw", fontWeight: "bold", margin: "0" }}>{news.title}</p>
                            </div>
                        </div>
                    </Col>
                ))}

                {/* View More Button (12th Div) */}
                <Col span={6}>
                    <div style={{ height: '100%', alignItems:'center', display:'flex'}}>
                        <Button
                            shape="circle"
                            style={{
                                width: "8vw",
                                height: "4vw",
                                fontSize: "1vw",
                                background: "red",
                                transition: "0.3s ease",
                                color:'white'
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

export default LandingPageEighthPart;
