import React, { useState } from "react";
import { Row, Col, Card, Typography, Breadcrumb, Input, Checkbox, Form, Divider } from "antd";
import MenuNavBar from "../../components/navbars/foodMenu/MenuNavBar";
import { routeNames } from "../../constaints/routeName";
import OrderSummaryCard from "../../components/cards/foodMenu/OrderSummaryCard";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const OrderInformationPage = () => {
    const [isRecipientChecked, setIsRecipientChecked] = useState(false);
    const navigate = useNavigate();
    return (
        <div>
            <MenuNavBar />
            <div style={{ padding: "5vh 10vw", backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        {
                            title: <Title level={5}><a href={routeNames.foodMenu.main}>Home</a></Title>,
                        },
                        {
                            title: <Title level={5}><a href={routeNames.foodMenu.myCart}>My Cart</a></Title>,
                        },
                        {
                            title: <Title level={5}>Order Information</Title>,
                        }
                    ]}
                />

                <Row gutter={[16, 16]}>
                    {/* Left Column (18/24) - Main Order Details */}
                    <Col xs={24} lg={18}>
                        <div style={{ margin: '0 12vw' }}>
                            <div style={{ textAlign: "center", marginBottom: "2vh" }}>
                                <Title level={3} style={{ display: "inline-block", color: 'rgba(255, 0, 0, 0.8)', fontSize: "1.5vw" }}>Checkout</Title>
                                <Divider style={{ margin: "1vh auto", width: "50%", borderTop: "1px solid rgba(255, 0, 0, 0.8)" }} />
                            </div>
                            <Paragraph style={{ fontSize: "1vw" }}>Please provide your delivery details</Paragraph>

                            <Card
                                style={{
                                    borderRadius: "10px",
                                    backgroundColor: "white",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                }}
                            >
                                {/* Delivery Form */}
                                <Form layout="vertical">
                                    {/* Name */}
                                    <Form.Item label={<span style={{ fontSize: "0.8vw" }}>Your Name</span>}
                                        name="name"
                                        rules={[{ required: true, message: "Please enter your name" }]}>
                                        <Input placeholder="Enter your name" style={{ fontSize: "0.8vw" }} />
                                    </Form.Item>

                                    {/* Phone Number */}
                                    <Form.Item
                                        label={<span style={{ fontSize: "0.8vw" }}>Phone Number</span>}
                                        name="phone"
                                        rules={[
                                            { required: true, message: "Please enter your phone number" },
                                            { pattern: /^[0-9]{9,10}$/, message: "Phone number must be 9 or 10 digits" }
                                        ]}>
                                        <Input placeholder="Enter your phone number" style={{ fontSize: "0.8vw" }} />
                                    </Form.Item>

                                    {/* Recipient Checkbox */}
                                    <Form.Item>
                                        <Checkbox
                                            checked={isRecipientChecked}
                                            onChange={(e) => setIsRecipientChecked(e.target.checked)}
                                            style={{ fontSize: "0.8vw" }}>
                                            Recipient information (If applicable)
                                        </Checkbox>
                                    </Form.Item>

                                    {/* Sliding Recipient Fields with Pure CSS */}
                                    <div className={`recipient-section ${isRecipientChecked ? "open" : ""}`} style={{ fontSize: "1vw" }}>
                                        {/* Recipient Name */}
                                        <Form.Item
                                            label={<span style={{ fontSize: "0.8vw" }}>Recipient Name</span>}
                                            name="recipientName"
                                            rules={[{ required: isRecipientChecked, message: "Please enter the recipient's name" }]}>
                                            <Input placeholder="Enter recipient name" style={{ fontSize: "0.8vw" }} />
                                        </Form.Item>

                                        {/* Recipient Phone Number */}
                                        <Form.Item
                                            label={<span style={{ fontSize: "0.8vw" }}>Recipient Phone Number</span>}
                                            name="recipientPhone"
                                            rules={[
                                                { required: isRecipientChecked, message: "Please enter the recipient's phone number" },
                                                { pattern: /^[0-9]{9,10}$/, message: "Phone number must be 9 or 10 digits" }
                                            ]}>
                                            <Input placeholder="Enter recipient phone number" style={{ fontSize: "0.8vw" }} />
                                        </Form.Item>
                                    </div>

                                    {/* Note */}
                                    <Form.Item label={<span style={{ fontSize: "0.8vw" }}>Note</span>} name="note">
                                        <Input.TextArea placeholder="Enter any additional note (optional)" rows={3} style={{ fontSize: "0.8vw" }} />
                                    </Form.Item>
                                </Form>
                            </Card>
                        </div>

                    </Col>

                    {/* Right Column (6/24) - Order Summary */}
                    <Col xs={24} lg={6}>
                        <OrderSummaryCard
                            onCancel={() => navigate(routeNames.foodMenu.myCart)} />
                    </Col>
                </Row>
            </div>

            {/* CSS for animation */}
            <style>
                {`
                .recipient-section {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
                    opacity: 0;
                }
                
                .recipient-section.open {
                    max-height: 300px; /* Large enough value to fit the content */
                    opacity: 1;
                }
                `}
            </style>
        </div>
    );
};

export default OrderInformationPage;
