import React, { useContext, useEffect, useState } from "react";
import { Layout, Card, Spin, Button, message } from "antd";
import axiosInstance from "../../service/axios";
import { AuthContext } from "../../context/AuthContext";
import { apiEndPoints } from "../../constaints/apiEndPoint";

const { Content } = Layout;

const HomePageGuest = () => {
    const { userId } = useContext(AuthContext);
    const [bookingInfo, setBookingInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [canceling, setCanceling] = useState(false);

    useEffect(() => {
        const fetchBookingInfo = async () => {
            if (userId) {
                setLoading(true);
                try {
                    const response = await axiosInstance.get(apiEndPoints.BOOKING_INFORMATION.GET_CURRENT_BOOKING(userId));
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
            await axiosInstance.put(apiEndPoints.BOOKING_INFORMATION.EDIT(bookingInfo.id, 0));
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
        // Handle the logic for editing the booking, e.g., open a modal or navigate to an edit page.
        message.info('Edit booking functionality not implemented yet.');
    };

    return (
        <Content style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                    <Spin spinning={loading || canceling}>
                        {bookingInfo ? (
                            <Card
                                title="Current Booking Information"
                                extra={[
                                    <Button key="cancel" onClick={handleCancelBooking} disabled={canceling} danger style={{ marginRight: '8px' }}>
                                        Cancel
                                    </Button>,
                                    <Button key="edit" onClick={handleEditBooking} type="primary">
                                        Edit
                                    </Button>
                                ]}
                            >
                                <p><strong>Date:</strong> {new Date(bookingInfo.time).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {new Date(bookingInfo.time).toLocaleTimeString()}</p>
                                <p><strong>Branch:</strong> {bookingInfo.branchName}</p>
                                <p><strong>Number of People:</strong> {bookingInfo.numberOfPeople}</p>
                                <p><strong>Status:</strong> {bookingInfo.bookingStatus}</p>
                                <p><strong>Message:</strong> {bookingInfo.message}</p>
                            </Card>
                        ) : (
                            !loading && <Card title="No current booking information available" />
                        )}
                    </Spin>
                </div>
                <div>
                    {/* You can add additional content here for the right half of the page */}
                </div>
            </div>
        </Content>
    );
};

export default HomePageGuest;
