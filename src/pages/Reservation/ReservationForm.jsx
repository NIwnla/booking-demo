import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, Select, Checkbox } from 'antd';
// @ts-ignore
import ReservationBackground from '../../assets/ReservationBackground.jpg';
import { routeNames } from '../../constaints/routeName';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ReservationForm = () => {
    const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds

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

    return (
        <div style={{
            position: 'relative',
        }}>
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
                        <div style={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px'
                        }}>
                            <Text strong>Pizza 4P's Hoang Thang</Text>
                            <br />
                            <Text>2 People</Text>
                            <br />
                            <Text>05/03/2024, 15:45 PM</Text>
                        </div>
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
                    <Form layout="vertical">
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <Form.Item
                                label="First Name"
                                name="firstName"
                                rules={[{ required: true, message: 'Please input your first name!' }]}
                                style={{ flex: 1 }}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Last Name"
                                name="lastName"
                                rules={[{ required: true, message: 'Please input your last name!' }]}
                                style={{ flex: 1 }}
                            >
                                <Input />
                            </Form.Item>
                        </div>

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
                                name="mobile"
                                rules={[{ required: true, message: 'Please input your mobile number!' }]}
                                style={{ flex: 1 }}
                            >
                                <Input.Group compact>
                                    <Select defaultValue="+84" style={{ width: '20%' }}>
                                        <Select.Option value="+84">+84</Select.Option>
                                    </Select>
                                    <Input style={{ width: '80%' }} />
                                </Input.Group>
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
                    <Form layout="vertical">
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
    );
};

export default ReservationForm;