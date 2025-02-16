import React, { useState } from "react";
import { Row, Col, Card, Typography, Breadcrumb, Input, Checkbox, Form, Divider } from "antd";
import MenuNavBar from "../../components/navbars/foodMenu/MenuNavBar";
import { routeNames } from "../../constaints/routeName";
import OrderSummaryCard from "../../components/cards/foodMenu/OrderSummaryCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;

const OrderInformationPage = () => {
    const { t } = useTranslation("global");
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
                            title: <Title level={5}><a href={routeNames.foodMenu.main}>{t('foodMenu.breadcrumbs.home')}</a></Title>,
                        },
                        {
                            title: <Title level={5}><a href={routeNames.foodMenu.myCart}>{t('foodMenu.breadcrumbs.myCart')}</a></Title>,
                        },
                        {
                            title: <Title level={5}>{t('foodMenu.orderInformation.title')}</Title>,
                        }
                    ]}
                />

                <Row gutter={[16, 16]}>
                    {/* Left Column (18/24) - Main Order Details */}
                    <Col xs={24} lg={18}>
                        <div style={{ margin: '0 12vw' }}>
                            <div style={{ textAlign: "center", marginBottom: "2vh" }}>
                                <Title level={3} style={{ display: "inline-block", color: 'rgba(255, 0, 0, 0.8)', fontSize: "1.5vw" }}>
                                    {t('foodMenu.orderInformation.checkout')}
                                </Title>
                                <Divider style={{ margin: "1vh auto", width: "50%", borderTop: "1px solid rgba(255, 0, 0, 0.8)" }} />
                            </div>
                            <Paragraph style={{ fontSize: "1vw" }}>
                                {t('foodMenu.orderInformation.provideDetails')}
                            </Paragraph>

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
                                    <Form.Item
                                        label={<span style={{ fontSize: "0.8vw" }}>{t('foodMenu.orderInformation.yourName')}</span>}
                                        name="name"
                                        rules={[{ required: true, message: t('foodMenu.orderInformation.rules.nameRequired') }]}
                                    >
                                        <Input placeholder={t('foodMenu.orderInformation.placeholders.yourName')} style={{ fontSize: "0.8vw" }} />
                                    </Form.Item>

                                    {/* Phone Number */}
                                    <Form.Item
                                        label={<span style={{ fontSize: "0.8vw" }}>{t('foodMenu.orderInformation.phoneNumber')}</span>}
                                        name="phone"
                                        rules={[
                                            { required: true, message: t('foodMenu.orderInformation.rules.phoneRequired') },
                                            { pattern: /^[0-9]{9,10}$/, message: t('foodMenu.orderInformation.rules.phonePattern') }
                                        ]}
                                    >
                                        <Input placeholder={t('foodMenu.orderInformation.placeholders.phoneNumber')} style={{ fontSize: "0.8vw" }} />
                                    </Form.Item>

                                    {/* Recipient Checkbox */}
                                    <Form.Item>
                                        <Checkbox
                                            checked={isRecipientChecked}
                                            onChange={(e) => setIsRecipientChecked(e.target.checked)}
                                            style={{ fontSize: "0.8vw" }}
                                        >
                                            {t('foodMenu.orderInformation.recipientInfo')}
                                        </Checkbox>
                                    </Form.Item>

                                    {/* Sliding Recipient Fields with Pure CSS */}
                                    <div className={`recipient-section ${isRecipientChecked ? "open" : ""}`} style={{ fontSize: "1vw" }}>
                                        {/* Recipient Name */}
                                        <Form.Item
                                            label={<span style={{ fontSize: "0.8vw" }}>{t('foodMenu.orderInformation.recipientName')}</span>}
                                            name="recipientName"
                                            rules={[{ required: isRecipientChecked, message: t('foodMenu.orderInformation.rules.recipientNameRequired') }]}
                                        >
                                            <Input placeholder={t('foodMenu.orderInformation.placeholders.recipientName')} style={{ fontSize: "0.8vw" }} />
                                        </Form.Item>

                                        {/* Recipient Phone Number */}
                                        <Form.Item
                                            label={<span style={{ fontSize: "0.8vw" }}>{t('foodMenu.orderInformation.recipientPhoneNumber')}</span>}
                                            name="recipientPhone"
                                            rules={[
                                                { required: isRecipientChecked, message: t('foodMenu.orderInformation.rules.recipientPhoneRequired') },
                                                { pattern: /^[0-9]{9,10}$/, message: t('foodMenu.orderInformation.rules.recipientPhonePattern') }
                                            ]}
                                        >
                                            <Input placeholder={t('foodMenu.orderInformation.placeholders.recipientPhoneNumber')} style={{ fontSize: "0.8vw" }} />
                                        </Form.Item>
                                    </div>

                                    {/* Note */}
                                    <Form.Item
                                        label={<span style={{ fontSize: "0.8vw" }}>{t('foodMenu.orderInformation.note')}</span>}
                                        name="note"
                                    >
                                        <Input.TextArea placeholder={t('foodMenu.orderInformation.placeholders.note')} rows={3} style={{ fontSize: "0.8vw" }} />
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
