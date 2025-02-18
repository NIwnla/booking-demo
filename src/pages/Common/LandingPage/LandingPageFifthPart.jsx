import { LinkOutlined } from '@ant-design/icons';
import { Col, Row, Typography } from "antd";
import React from "react";

const {Title, Text} = Typography;

export default function LandingPageFifthPart() {
    return (
        <div style={{ width: "100%", padding: "8vh 8vw", backgroundColor: "#f5f5f5", position: 'relative', zIndex: 1 }}>
            {/* Instagram & YouTube Section */}
            <Row gutter={[64, 64]}>
                {/* Instagram Section (16 columns) */}
                <Col xs={24} md={16} style={{ padding: "16px"}}>
                    <a style={{ fontSize: "2vw", marginBottom: "2vh", color: 'black' }}>Follow <strong>Instagram</strong> <LinkOutlined /></a>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                        {[...Array(9)].map((_, index) => (
                            <div key={index} style={{ width: "100%", height: "13vw", backgroundColor: "#d9d9d9", borderRadius: "8px" }}></div>
                        ))}
                    </div>
                </Col>

                {/* YouTube Section (8 columns) */}
                <Col xs={24} md={8} style={{ padding: "16px"}}>
                    <a style={{ fontSize: "2vw", marginBottom: "2vh", color:'black' }}>Subscribe <strong>YouTube</strong> <LinkOutlined /></a>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                        {[...Array(3)].map((_, index) => (
                            <div key={index} style={{ width: "100%", height: "13vw", backgroundColor: "#d9d9d9", borderRadius: "8px" }}></div>
                        ))}
                    </div>
                </Col>
            </Row>

            {/* Facebook Section (24 columns) */}
            <Row gutter={[16, 16]} style={{ marginTop: "2vh" }}>
                <Col xs={24} style={{ padding: "16px"}}>
                    <a style={{ fontSize: "2vw", marginBottom: "2vh", color: 'black' }}>Follow <strong>Facebook</strong> <LinkOutlined /></a>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                        {[...Array(3)].map((_, index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <div style={{ width: "10vw", height: "13vw", backgroundColor: "#d9d9d9", borderRadius: "8px" }}></div>
                                <Text style={{ fontSize: "1vw" }}>Facebook Post {index + 1}</Text>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    );
}
