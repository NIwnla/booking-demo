import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Card, Col, Form, Image, Input, Modal, Row, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { routeNames } from '../../constaints/routeName';
import axiosInstance from '../../service/axios';
import './BookingPage.css'; // Import styles to match BookingPage
import FoodPreorderSection from './FoodPreOrderSection';

const { Title, Text } = Typography;

const BookingEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [preorderData, setPreorderData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { message } = App.useApp();

    useEffect(() => {
        const fetchBookingDetails = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(apiEndPoints.BOOKING_INFORMATION.GET(id));
                const bookingData = response.data;
                form.setFieldsValue({
                    numberOfPeople: bookingData.numberOfPeople,
                    numberOfChildren: bookingData.numberOfChildren,
                    message: bookingData.message,
                    preorder: bookingData.preorder
                });

                if (bookingData.preOrderItems.length > 0) {
                    setPreorderData(bookingData.preOrderItems)
                }
            } catch (error) {
                message.error('Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [id, form]);

    const handlePreorder = (preorderItem, quantity) => {
        setPreorderData(prev => {
            const updated = [...prev];
            const existingIndex = updated.findIndex(item => item.id === preorderItem.id);
            if (existingIndex !== -1) {
                updated[existingIndex].quantity = quantity;
            } else {
                updated.push({ ...preorderData, quantity });
            }
            return updated;
        });
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axiosInstance.put(apiEndPoints.BOOKING_INFORMATION.EDIT(id), {
                ...values,
                preorder: preorderData.map(item => `[${item.id}${item.isOption ? ' - option' : ''}: ${item.quantity}]`).join(', ')
            });
            message.success('Booking updated successfully');
            navigate(routeNames.index);
        } catch (error) {
            message.error('Failed to update booking');
        } finally {
            setLoading(false);
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Row gutter={24}>
            <Col xs={24} md={12}>
                <div style={styles.formContainer}>
                    <Title level={3}
                        // @ts-ignore
                        style={styles.formTitle}>
                        Edit Booking
                    </Title>
                    <Spin spinning={loading}>
                        <Form form={form} onFinish={onFinish} layout="vertical">
                            <Form.Item
                                name="numberOfPeople"
                                label="Number of People"
                                rules={[{ required: true, message: 'Please input the number of people!' }]}
                            >
                                <Input type="number" />
                            </Form.Item>

                            <Form.Item
                                name="numberOfChildren"
                                label="Number of Children"
                            >
                                <Input type="number" />
                            </Form.Item>

                            <Form.Item
                                name="message"
                                label="Message"
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Save Changes
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>
                </div>
            </Col>

            <Col xs={24} md={12} className="preorder-food-section">
                <div style={styles.preorderContainer}>
                    <Title level={4} style={styles.preorderTitle}>
                        Preordered Food
                    </Title>

                    <div
                        // @ts-ignore
                        style={styles.scrollableContent}>
                        <Spin spinning={loading}>
                            {preorderData.length > 0 ? (
                                <Row gutter={[16, 16]}>
                                    {preorderData.map((item, index) => (
                                        <Col key={item.id || index} xs={24} lg={12} xl={6}>
                                            <Card
                                                hoverable
                                                cover={
                                                    <Image
                                                        src={`${AxiosConstants.AXIOS_BASEURL}/${item.imagePath}`}
                                                        alt={item.name}
                                                        // @ts-ignore
                                                        style={styles.foodImage}
                                                    />
                                                }
                                                actions={[
                                                    <Button
                                                        type="link"
                                                        onClick={() =>
                                                            setPreorderData((prev) => prev.filter((_, i) => i !== index))
                                                        }
                                                        style={styles.removeButton}
                                                    >
                                                        Remove
                                                    </Button>,
                                                ]}
                                            >
                                                <Card.Meta
                                                    title={item.name}
                                                    description={
                                                        <>
                                                            <p><strong>Quantity:</strong> {item.quantity}</p>
                                                            <p><strong>Price:</strong> {item.price}</p>
                                                        </>
                                                    }
                                                />
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <Text type="secondary">No preordered food.</Text>
                            )}
                        </Spin>
                    </div>
                </div>
            </Col>

            <Col xs={24}>
                <FoodPreorderSection onPreorder={handlePreorder} />
            </Col>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                // @ts-ignore
                style={styles.floatingButton}
                onClick={showModal}
                className="floating-button"
            >
                Đồ ăn đặt trước
            </Button>

            <Modal
                title="Đồ ăn đặt trước"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <div
                    // @ts-ignore
                    style={styles.scrollableContent}>
                    <Spin spinning={loading}>
                        {preorderData.length > 0 ? (
                            <Row gutter={[16, 16]}>
                                {preorderData.map((item, index) => (
                                    <Col key={item.id || index} xs={24} sm={12} md={8} lg={6}>
                                        <Card
                                            hoverable
                                            cover={
                                                <Image
                                                    src={`${AxiosConstants.AXIOS_BASEURL}/${item.imagePath}`}
                                                    alt={item.name}
                                                    // @ts-ignore
                                                    style={styles.foodImage}
                                                />
                                            }
                                            actions={[
                                                <Button
                                                    type="link"
                                                    onClick={() =>
                                                        setPreorderData((prev) => prev.filter((_, i) => i !== index))
                                                    }
                                                    style={styles.removeButton}
                                                >
                                                    Remove
                                                </Button>,
                                            ]}
                                        >
                                            <Card.Meta
                                                title={item.name}
                                                description={
                                                    <>
                                                        <p><strong>Quantity:</strong> {item.quantity}</p>
                                                        <p><strong>Price:</strong> ${item.price}</p>
                                                    </>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Text type="secondary">No preordered food.</Text>
                        )}
                    </Spin>
                </div>
            </Modal>
        </Row>
    );
};

const styles = {
    formContainer: {
        padding: '24px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    formTitle: {
        textAlign: 'center',
        marginBottom: '24px',
    },
    preorderContainer: {
        padding: '24px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    preorderTitle: {
        marginBottom: '16px',
    },
    scrollableContent: {
        maxHeight: '65vh',
        overflowY: 'auto',
    },
    foodImage: {
        height: '150px',
        objectFit: 'cover',
        borderRadius: '8px',
    },
    removeButton: {
        color: 'red',
    },
    floatingButton: {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 999,
        maxWidth: '20vh',
    },
    modalBody: {
        maxHeight: '65vh',
        overflowY: 'auto',
    },
};

export default BookingEditPage;
