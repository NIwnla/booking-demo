import { App, Button, Card, Col, Image, Layout, Row, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive'; // For media queries
import { useNavigate } from "react-router-dom";
import { apiEndPoints } from "../../constaints/apiEndPoint";
import { AxiosConstants } from "../../constaints/axiosContaint";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../service/axios";

const { Content } = Layout;

const HomePageGuest = () => {
    const { userId } = useContext(AuthContext);
    const [bookingInfo, setBookingInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [canceling, setCanceling] = useState(false);
    const navigate = useNavigate();
    const { message } = App.useApp();

    // Using media query to detect small screens
    const isSmallScreen = useMediaQuery({ query: '(max-width: 576px)' });

    useEffect(() => {
        const fetchBookingInfo = async () => {
            if (userId) {
                setLoading(true);
                try {
                    const response = await axiosInstance.get(apiEndPoints.BOOKING_INFORMATION.GET_CURRENT_BOOKING);
                    setBookingInfo(response.data);
                } catch (error) {
                    console.error("Failed to fetch booking information:", error);
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
            message.success('Booking canceled successfully');
            setBookingInfo(null); // Clear booking info after cancellation
        } catch (error) {
            console.error("Failed to cancel booking:", error);
            message.error('Failed to cancel booking');
        } finally {
            setCanceling(false);
        }
    };

    const handleEditBooking = () => {
        if (bookingInfo && bookingInfo.id) {
            navigate(`/booking/edit/${bookingInfo.id}`);
        }
    };

    return (
        <Content style={{ padding: '0px' }}>
            <div>
                <Spin spinning={loading || canceling}>
                    {bookingInfo ? (
                        <Card
                            title="Current Booking Information"
                            extra={
                                !isSmallScreen && (
                                    <>
                                        <Button key="cancel" onClick={handleCancelBooking} disabled={canceling} danger style={{ marginRight: '8px' }}>
                                            Cancel
                                        </Button>
                                        <Button key="edit" onClick={handleEditBooking} type="primary">
                                            Edit
                                        </Button>
                                    </>
                                )
                            }
                        >
                            <p><strong>Date:</strong> {new Date(bookingInfo.time).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {new Date(bookingInfo.time).toLocaleTimeString()}</p>
                            <p><strong>Branch:</strong> {bookingInfo.branchName}</p>
                            <p><strong>People:</strong> {bookingInfo.numberOfPeople}</p>
                            {bookingInfo.numberOfChildren && (<p><strong>Children:</strong> {bookingInfo.numberOfChildren}</p>)}
                            <p><strong>Status:</strong> {bookingInfo.bookingStatus}</p>
                            {bookingInfo.message && (<p><strong>Message:</strong> {bookingInfo.message}</p>)}
                            {bookingInfo.preOrderItems && bookingInfo.preOrderItems.length > 0 && (
                                <>
                                    <p><strong>Preordered Items:</strong></p>
                                    <div className="preorder-items-container">
                                        <Row gutter={[16, 16]}>
                                            {bookingInfo.preOrderItems.map((item, index) => (
                                                <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                                                    <div className="preorder-item">
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
                                                        <p><strong>Name:</strong> {item.name}</p>
                                                        <p><strong>Quantity:</strong> {item.quantity}</p>
                                                        <p><strong>Price:</strong> {item.price}</p>
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
                                            Cancel
                                        </Button>
                                    </Col>
                                    <Col span={12}>
                                        <Button block type="primary" onClick={handleEditBooking}>
                                            Edit
                                        </Button>
                                    </Col>
                                </Row>
                            )}
                        </Card>
                    ) : (
                        !loading && <Card title="No current booking information available" />
                    )}
                </Spin>
            </div>
        </Content>
    );
};

export default HomePageGuest;
