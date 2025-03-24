import { App, Button, Card, Checkbox, Form, Input, Modal, Select, Space, Spin, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// @ts-ignore
import ReservationBackground from '../../assets/ReservationBackground.jpg';
import { routeNames } from '../../constaints/routeName';
import { getLocalizedText } from './../../helpers/getLocalizedText';
import { useTranslation } from 'react-i18next';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import axiosInstance from '../../service/axios';
import { AuthContext } from '../../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const { Title, Text } = Typography;

const ReservationForm = () => {
    const [timeRemaining, setTimeRemaining] = useState(3000); // 5 minutes in seconds
    const location = useLocation();
    const { userId, isAuthenticated, setReturnPath } = useContext(AuthContext);
    const locationState = location?.state;
    const { branch, time, adult, date } = locationState;
    const [isFetching, setIsFetching] = useState(false);
    const { message } = App.useApp();
    const { i18n } = useTranslation('global');

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const [form1] = Form.useForm();
    const [form2] = Form.useForm();

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    navigate(routeNames.reservation.main);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        // Cleanup on component unmount
        return () => clearInterval(timer);
    }, [navigate]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };



    const handleSubmit = async () => {
        try {
            const personalInfo = await form1.validateFields();
            const requestInfo = await form2.validateFields();

            const formData = {
                userId: userId || null,
                userFullName: personalInfo.fullName,
                email: personalInfo.email,
                adult: parseInt(adult),
                peopleOver60: parseInt(requestInfo.peopleOver60) || 0,
                peopleUnder6: parseInt(requestInfo.peopleUnder6) || 0,
                phonePrefix: personalInfo.phonePrefix,
                mobile: personalInfo.mobile,
                phoneNumber: `${personalInfo.phonePrefix}${personalInfo.mobile}`,
                smsNotification: personalInfo.smsNotification || false,
                restaurantNotes: requestInfo.restaurantNotes || '',
                preorder: '',
                branchId: branch.id,
                time: new Date(`${date}T${time}`).toISOString()
            };

            setIsFetching(true);
            await axiosInstance.post(apiEndPoints.BOOKING_INFORMATION.CREATE, formData);
            message.success('Booking successful!');
            navigate(routeNames.reservation.main);

        } catch (error) {
            message.error(error.response.data);
        } finally {
            setIsFetching(false);
        }
    };


    // Add this function to handle the booking button click
    const handleBookingClick = () => {
        if (!isAuthenticated) {
            setIsLoginModalOpen(true);
            return;
        }
        handleSubmit();
    };

    const handleLoginClick = () => {
        if (!isAuthenticated) {
            setReturnPath(routeNames.reservation.main);
            // Save current reservation state
        }
        navigate(routeNames.login);
    }

    return (
        <>
            <Helmet>
                <title>Complete Reservation - Nollowa Chicken</title>
                <meta name="description" content="Complete your table reservation at Nollowa Chicken" />
            </Helmet>
            <div style={{ position: 'relative' }}>
                {/* Blurred Background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${ReservationBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(6px)',
                    zIndex: 0,
                }} />

                {/* Content Container */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '2rem',
                    position: 'relative',
                    minHeight: '100vh',
                }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem', color: 'white' }}>
                        Please check your booking Information
                    </Title>
                    <Card style={{
                        width: '100%',
                        maxWidth: 800,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        marginBottom: '2rem',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            {isAuthenticated ? (
                                <div style={{
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '8px'
                                }}>
                                    <Text strong>{branch && (getLocalizedText(branch, "name", i18n.language))}</Text>
                                    <br />
                                    <Text>{adult} People</Text>
                                    <br />
                                    <Text>{date}, {time}PM</Text>
                                </div>
                            ) : (
                                <div style={{
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '8px'
                                }}>
                                    <Text>Please login to make a reservation. Logging in allows you to:</Text>
                                    <ul>
                                        <li>Track your reservation status</li>
                                        <li>Receive booking confirmations</li>
                                        <li>Manage your bookings</li>
                                        <li onClick={handleLoginClick}>
                                            <Text style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Login</Text>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            <div style={{
                                textAlign: 'right',
                                color: 'red'
                            }}>
                                Remaining Time: <br />{formatTime(timeRemaining)}
                            </div>
                        </div>
                    </Card>
                    <div style={{ width: '100%', maxWidth: 800 }}>
                        <Title level={2} style={{ textAlign: 'start', marginBottom: '2rem', color: 'white' }}>
                            Please check your booking Information
                        </Title>
                    </div>
                    <Card style={{
                        width: '100%',
                        maxWidth: 800,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        marginBottom: '2rem',
                    }}>
                        <Form layout="vertical" form={form1} name="personal_info">
                            <Form.Item
                                label="Full Name"
                                name="fullName"
                                rules={[{ required: true, message: 'Please input your full name!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your email!' },
                                    { type: 'email', message: 'Please enter a valid email!' }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <Form.Item
                                    label="Mobile"
                                    style={{ flex: 1 }}
                                >
                                    <Space.Compact style={{ width: '100%' }}>
                                        <Form.Item
                                            name="phonePrefix"
                                            noStyle
                                            initialValue="+84"
                                        >
                                            <Select style={{ width: '100px' }}>
                                                <Select.Option value="+84">+84 VN</Select.Option>
                                                <Select.Option value="+1">+1 US</Select.Option>
                                                <Select.Option value="+44">+44 UK</Select.Option>
                                                <Select.Option value="+81">+81 JP</Select.Option>
                                                <Select.Option value="+86">+86 CN</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            name="mobile"
                                            noStyle
                                            rules={[{ required: true, message: 'Please input your phone number!' }]}
                                        >
                                            <Input style={{ width: '100%' }} placeholder="Phone number" />
                                        </Form.Item>
                                    </Space.Compact>
                                </Form.Item>

                                <Form.Item
                                    name="smsNotification"
                                    valuePropName="checked"
                                    style={{ flex: 1, marginTop: '29px' }}
                                >
                                    <Checkbox>Notify me via SMS</Checkbox>
                                </Form.Item>
                            </div>

                        </Form>
                    </Card>

                    <div style={{ width: '100%', maxWidth: 800 }}>
                        <Title level={2} style={{ textAlign: 'start', marginBottom: '2rem', color: 'white' }}>
                            Request to restaurant
                        </Title>
                    </div>
                    <Card style={{
                        width: '100%',
                        maxWidth: 800,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        marginBottom: '2rem',
                    }}>
                        <Form layout="vertical" form={form2} name="request_info" >
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <Form.Item
                                    label="Over 60 Years Old"
                                    name="peopleOver60"
                                    style={{ flex: 1 }}
                                >
                                    <Input type="number" min={0} placeholder="Optional" />
                                </Form.Item>

                                <Form.Item
                                    label="Under 6 Years Old"
                                    name="peopleUnder6"
                                    style={{ flex: 1 }}
                                >
                                    <Input type="number" min={0} placeholder="Optional" />
                                </Form.Item>
                            </div>

                            <Form.Item
                                label="Additional Notes for Restaurant"
                                name="restaurantNotes"
                            >
                                <Input.TextArea
                                    placeholder="Any special requests or notes for the restaurant..."
                                    rows={4}
                                />
                            </Form.Item>
                        </Form>
                    </Card>

                    <Card style={{
                        width: '100%',
                        maxWidth: 800,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        marginBottom: '2rem',
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}>
                            <Text style={{ textAlign: 'center' }}>
                                By clicking this button, I agree with these{' '}
                                <a href="#">General Terms & Conditions</a>
                            </Text>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleBookingClick}
                                loading={isFetching}
                                style={{
                                    width: '100%',
                                    fontSize: '1rem'
                                }}
                            >
                                Confirm Booking ({formatTime(timeRemaining)})
                            </Button>
                            <Button
                                type="link"
                                href={routeNames.reservation.main}
                                style={{
                                    fontSize: '1rem'
                                }}
                            >
                                Select another table
                            </Button>
                        </div>
                    </Card>

                </div>

            </div>
            <Modal
                title="Login Required"
                open={isLoginModalOpen}
                onCancel={() => setIsLoginModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsLoginModalOpen(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="login"
                        type="primary"
                        onClick={() => {
                            setIsLoginModalOpen(false);
                            handleLoginClick();
                        }}
                    >
                        Login
                    </Button>
                ]}
            >
                <p>Please login to make a reservation.</p>
            </Modal>
        </>
    );
};

export default ReservationForm;