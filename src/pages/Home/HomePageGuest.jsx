import { App, Button, Card, Col, Collapse, Image, Layout, Row, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive'; // For media queries
import { useNavigate } from "react-router-dom";
import { apiEndPoints } from "../../constaints/apiEndPoint";
import { AxiosConstants } from "../../constaints/axiosContaint";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../service/axios";
import { useTranslation } from "react-i18next";

const { Content } = Layout;

const HomePageGuest = () => {
    const { t } = useTranslation('global');
    const { userId } = useContext(AuthContext);
    const [bookingInfo, setBookingInfo] = useState(null);
    const [deliveryInfo, setDeliveryInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [canceling, setCanceling] = useState(false);
    const navigate = useNavigate();
    const { message } = App.useApp();

    // Using media query to detect small screens
    const isSmallScreen = useMediaQuery({ query: '(max-width: 576px)' });

    useEffect(() => {
        const fetchDeliveryInfo = async () => {
            if (userId) {
                setLoading(true);
                try {
                    const response = await axiosInstance.get(apiEndPoints.DELIVERY_INFORMATION.GET_CURRENT);
                    setDeliveryInfo(response.data);
                } catch (error) {
                    message.error(t("homePageGuest.messages.fetchDeliveryError"));
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchDeliveryInfo();
    }, [userId]);

    useEffect(() => {
        const fetchBookingInfo = async () => {
            if (userId) {
                setLoading(true);
                try {
                    const response = await axiosInstance.get(apiEndPoints.BOOKING_INFORMATION.GET_CURRENT_BOOKING);
                    setBookingInfo(response.data);
                } catch (error) {
                    message.error(t("homePageGuest.messages.fetchBookingError"));
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchBookingInfo();
    }, [userId]);

    const handleCancelBooking = async () => {
        if (!bookingInfo) return;

        setCanceling(true);
        try {
            await axiosInstance.put(apiEndPoints.BOOKING_INFORMATION.EDIT_STATUS(bookingInfo.id, 0));
            message.success(t("homePageGuest.messages.cancelBookingSuccess"));
            setBookingInfo(null); // Clear booking info after cancellation
        } catch (error) {
            message.error(t("homePageGuest.messages.cancelBookingError"));
        } finally {
            setCanceling(false);
        }
    };

    const handleEditBooking = () => {
        if (bookingInfo && bookingInfo.id) {
            navigate(`/booking/edit/${bookingInfo.id}`);
        }
    };

    const renderDeliveryInformation = () => (
        <Content style={{ padding: '0px' }}>
            <div>
                <Spin spinning={loading}>
                    {deliveryInfo ? (
                        <Card
                            title={t("homePageGuest.titles.currentDelivery")}
                            style={{ backgroundColor: '#eeeeee' }}

                        >
                            <p><strong>{t("homePageGuest.labels.date")}:</strong> {new Date(deliveryInfo.time).toLocaleDateString()}</p>
                            <p><strong>{t("homePageGuest.labels.time")}:</strong> {new Date(deliveryInfo.time).toLocaleTimeString()}</p>
                            <p><strong>{t("homePageGuest.labels.location")}:</strong> {deliveryInfo.location}</p>
                            <p><strong>{t("homePageGuest.labels.phoneNumber")}:</strong> {deliveryInfo.phoneNumber}</p>
                            <p><strong>{t("homePageGuest.labels.status")}:</strong> {deliveryInfo.status}</p>
                            {deliveryInfo.message && (<p><strong>{t("homePageGuest.labels.message")}:</strong> {deliveryInfo.message}</p>)}
                            {deliveryInfo.preOrderItems && deliveryInfo.preOrderItems.length > 0 && (
                                <>
                                    <p><strong>{t("homePageGuest.labels.preOrderedItems")}:</strong></p>
                                    <div>
                                        <Row gutter={[16, 16]}>
                                            {deliveryInfo.preOrderItems.map((item, index) => (
                                                <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                                                    <div style={{ padding: '8px', background: '#ffffff', borderRadius: '20px' }}>
                                                        <Image
                                                            src={`${AxiosConstants.AXIOS_BASEURL}/${item.imagePath}`}  // Ensure the correct path for images
                                                            alt={item.name}
                                                            style={{
                                                                width: '100%',
                                                                height: '15vh',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px',
                                                                marginBottom: '10px',
                                                            }}
                                                        />
                                                        <p><strong>{t("homePageGuest.card.name")}:</strong> {item.name}</p>
                                                        <p><strong>{t("homePageGuest.card.quantity")}:</strong> {item.quantity}</p>
                                                        <p><strong>{t("homePageGuest.card.price")}:</strong> {item.price}</p>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                </>
                            )}
                        </Card>
                    ) : (
                        !loading && <Card title={t("homePageGuest.titles.noDelivery")} />
                    )}
                </Spin>
            </div>
        </Content>
    );

    const renderBookingInformation = () => (
        <Content style={{ padding: '0px' }}>
            <div>
                <Spin spinning={loading || canceling}>
                    {bookingInfo ? (
                        <Card
                            title={t("homePageGuest.titles.currentBooking")}
                            style={{ backgroundColor: '#eeeeee' }}
                            extra={
                                !isSmallScreen && (
                                    <>
                                        <Button key="cancel" onClick={handleCancelBooking} disabled={canceling} danger style={{ marginRight: '8px' }}>
                                            {t("homePageGuest.buttons.cancel")}
                                        </Button>
                                        <Button key="edit" onClick={handleEditBooking} type="primary">
                                            {t("homePageGuest.buttons.edit")}
                                        </Button>
                                    </>
                                )
                            }
                        >
                            <p><strong>{t("homePageGuest.labels.date")}:</strong> {new Date(bookingInfo.time).toLocaleDateString()}</p>
                            <p><strong>{t("homePageGuest.labels.time")}:</strong> {new Date(bookingInfo.time).toLocaleTimeString()}</p>
                            <p><strong>{t("homePageGuest.labels.branch")}:</strong> {bookingInfo.branchName}</p>
                            <p><strong>{t("homePageGuest.labels.people")}:</strong> {bookingInfo.numberOfPeople}</p>
                            {bookingInfo.numberOfChildren && (<p><strong>{t("homePageGuest.labels.children")}:</strong> {bookingInfo.numberOfChildren}</p>)}
                            <p><strong>{t("homePageGuest.labels.status")}:</strong> {bookingInfo.bookingStatus}</p>
                            {bookingInfo.message && (<p><strong>{t("homePageGuest.labels.message")}:</strong> {bookingInfo.message}</p>)}
                            {bookingInfo.preOrderItems && bookingInfo.preOrderItems.length > 0 && (
                                <>
                                    <p><strong>{t("homePageGuest.labels.preOrderedItems")}:</strong></p>
                                    <div>
                                        <Row gutter={[16, 16]}>
                                            {bookingInfo.preOrderItems.map((item, index) => (
                                                <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                                                    <div style={{ padding: '8px', background: '#ffffff', borderRadius: '20px' }}>
                                                        <Image
                                                            src={`${AxiosConstants.AXIOS_BASEURL}/${item.imagePath}`}  // Ensure the correct path for images
                                                            alt={item.name}
                                                            style={{
                                                                width: '100%',
                                                                height: '15vh',
                                                                objectFit: 'cover',
                                                                borderRadius: '8px',
                                                                marginBottom: '10px',
                                                            }}
                                                        />
                                                        <p><strong>{t("homePageGuest.card.name")}:</strong> {item.name}</p>
                                                        <p><strong>{t("homePageGuest.card.quantity")}:</strong> {item.quantity}</p>
                                                        <p><strong>{t("homePageGuest.card.price")}:</strong> {item.price}</p>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                </>
                            )}

                            {/* Buttons at the bottom for small screens */}
                            {isSmallScreen && (
                                <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                                    <Col span={12}>
                                        <Button block onClick={handleCancelBooking} danger disabled={canceling}>
                                            {t("homePageGuest.buttons.cancel")}
                                        </Button>
                                    </Col>
                                    <Col span={12}>
                                        <Button block type="primary" onClick={handleEditBooking}>
                                            {t("homePageGuest.buttons.edit")}
                                        </Button>
                                    </Col>
                                </Row>
                            )}
                        </Card>
                    ) : (
                        !loading && <Card title={t("homePageGuest.titles.noBooking")} />
                    )}
                </Spin>
            </div>
        </Content>
    )

    return (
        <Collapse
            items={[
                {
                    key: '1',
                    label: 'Toggle Booking Information',
                    children: renderBookingInformation(),
                },
                {
                    key: '2',
                    label: 'Toggle Delivery Information',
                    children: renderDeliveryInformation(),
                },
            ]}
        />
    );

    ;
};

export default HomePageGuest;
