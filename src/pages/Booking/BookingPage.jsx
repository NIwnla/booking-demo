import { Button, Card, Checkbox, Col, Form, Image, Input, message, Modal, Row, Space, Typography } from 'antd';
import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { routeNames } from '../../constaints/routeName';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../service/axios';
import FoodPreorderSection from './FoodPreOrderSection';
import { PlusOutlined } from '@ant-design/icons';
import './BookingPage.css'
import { showMessage } from '../../helpers/showMessage';

const { Title, Text } = Typography;

const BookingPage = () => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const location = useLocation();
    const { selectedDate, selectedTime, branchId } = location?.state;
    const { userId } = useContext(AuthContext);
    const [isFetching, setIsFetching] = useState(false);
    const [alertUnavailableTime, setAlertUnavailableTime] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
    const navigate = useNavigate();

    const [preorderedFoods, setPreorderedFoods] = useState([]);

    const onFinish = async (values) => {
        const time = `${selectedDate}T${selectedTime}:00.000Z`;

        const preorder = preorderedFoods && preorderedFoods.length > 0
            ? preorderedFoods.map(food => `[${food.id}${food.isOption ? ' - option' : ''}: ${food.quantity}]`).join(', ') : undefined;

        const payload = {
            userId,
            branchId,
            time,
            userFullName: values.fullname,
            numberOfPeople: values.numberOfPeople,
            numberOfChildren: values.numberOfChildren || undefined,
            phoneNumber: values.phoneNumber,
            message: values.message || undefined,
            preorder,
        };

        console.log('Payload for API:', payload);

        setIsFetching(true);
        try {
            const response = await axiosInstance.post(apiEndPoints.BOOKING_INFORMATION.CREATE, payload);
            showMessage("success", 'Booked successfully');
            navigate(routeNames.index);
        } catch (error) {
            showMessage("error", error.response.data);
        } finally {
            setIsFetching(false);
        }
    };

    const handleCheckboxChange = (e) => {
        setIsConfirmed(e.target.checked);
    };

    const handlePreorder = (food, quantity) => {
        setPreorderedFoods((prev) => {
            const existingFoodIndex = prev.findIndex(item => item.imagePath === food.imagePath);

            if (existingFoodIndex !== -1) {
                const updatedFoods = [...prev];
                updatedFoods[existingFoodIndex].quantity = quantity;
                return updatedFoods;
            } else {
                return [...prev, { ...food, quantity }];
            }
        });
    };

    const handleRemove = (indexToRemove) => {
        setPreorderedFoods((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    // Modal handling functions
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Row gutter={24}>
            <Col xs={24} md={12}>
                <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
                        Thông tin book vào {selectedDate} {selectedTime}
                    </Title>
                    <Form layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            name="fullname"
                            label="Full Name"
                            rules={[{ required: true, message: 'Làm ơn nhập tên đầy đủ của bạn' }]}
                        >
                            <Input placeholder="Tên đầy đủ" />
                        </Form.Item>

                        <Form.Item
                            name="numberOfPeople"
                            label="Number of People"
                            rules={[
                                { required: true, message: 'Làm ơn chọn số người dùng bàn' },
                            ]}
                        >
                            <Input placeholder="Chọn số người dùng bàn" type="number" min={2} />
                        </Form.Item>

                        <Form.Item
                            name="numberOfChildren"
                            label="Number of Children"
                        >
                            <Input placeholder="Chọn số trẻ em dùng bàn" type="number" />
                        </Form.Item>

                        <Form.Item
                            name="phoneNumber"
                            label="Phone Number"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại của bạn' },
                                { pattern: /^\d{9,10}$/, message: 'Số điện thoại phải có từ 9 đến 10 chữ số' }
                            ]}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>

                        <Form.Item name="message" label="Message">
                            <Input.TextArea placeholder="Message (Optional)" style={{ resize: 'none' }} />
                        </Form.Item>

                        <Text type="warning">
                            Quý khách vui lòng đến đúng giờ, nhà sẽ chỉ giữ bàn muộn hơn 10 phút so với giờ đặt bàn nhé!
                        </Text>

                        <Form.Item>
                            <Checkbox onChange={handleCheckboxChange}>Tôi xác nhận là sẽ đến đúng giờ.</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block disabled={!isConfirmed} loading={isFetching}>
                                Book Now
                            </Button>
                        </Form.Item>
                    </Form>
                    <Space direction="vertical" style={{ marginTop: '24px', textAlign: 'center' }}>
                        <Text type="danger">
                            Đối với bàn 6 trở lên người vui lòng nhắn tin qua Fanpage để được hỗ trợ:&nbsp;
                            <a href="https://www.facebook.com/profile.php?id=61562738210745&mibextid=LQQJ4d">Fanpage</a>
                        </Text>
                    </Space>
                </div>
            </Col>

            <Col xs={24} md={12} className="preorder-food-section">
                <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Title level={4} style={{ marginBottom: '16px' }}>Đồ ăn đặt trước</Title>
                    <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                        {preorderedFoods.length > 0 ? (
                            preorderedFoods.map((food, index) => (
                                <Card key={index} style={{ marginBottom: '16px' }}>
                                    <Row align="middle" style={{ width: '100%' }}>
                                        <Col span={8}>
                                            <Image
                                                src={`${axiosInstance.defaults.baseURL}/${food.imagePath}`}
                                                alt={food.name}
                                                style={{ width: '100%', height: '10vh', borderRadius: '8px' }}
                                            />
                                        </Col>
                                        <Col span={16}>
                                            <Space direction="vertical" size="small">
                                                <Text strong>{food.name}</Text>
                                                <Text>Quantity: {food.quantity}</Text>
                                                <Text type="secondary">{food.isOption ? 'Option' : 'Main Dish'}</Text>
                                                <Button
                                                    type="link"
                                                    onClick={() => handleRemove(index)}
                                                    style={{ color: 'red', padding: 0 }}
                                                >
                                                    Remove
                                                </Button>
                                            </Space>
                                        </Col>
                                    </Row>
                                </Card>

                            ))
                        ) : (
                            <Text type="secondary">Chưa có đồ ăn được đặt trước.</Text>
                        )}
                    </div>
                </div>
            </Col>

            <Col xs={24}>
                <FoodPreorderSection onPreorder={handlePreorder} />
            </Col>

            {/* Floating button for small screens */}
            <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 999, maxWidth: '20vh' }}
                onClick={showModal}
                className="floating-button"
            >
                Đồ ăn đặt trước
            </Button>

            {/* Modal to show preordered food list */}
            <Modal
                title="Preordered Food"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                styles={{
                    body: {
                        maxHeight: '65vh',
                        overflowY: 'auto'
                    }
                }}
            >
                {preorderedFoods.length > 0 ? (
                    preorderedFoods.map((food, index) => (
                        <Card key={index} style={{ marginBottom: '16px' }}>
                            <Row align="middle" style={{ width: '100%' }}>
                                <Col span={8}>
                                    <Image
                                        src={`${axiosInstance.defaults.baseURL}/${food.imagePath}`}
                                        alt={food.name}
                                        style={{ width: '100%', height: '10vh', borderRadius: '8px' }}
                                    />
                                </Col>
                                <Col span={16}>
                                    <Space direction="vertical" size="small">
                                        <Text strong>{food.name}</Text>
                                        <Text>Quantity: {food.quantity}</Text>
                                        <Text type="secondary">{food.isOption ? 'Option' : 'Main Dish'}</Text>
                                        <Button
                                            type="link"
                                            onClick={() => handleRemove(index)}
                                            style={{ color: 'red', padding: 0 }}
                                        >
                                            Remove
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Card>
                    ))
                ) : (
                    <Text type="secondary">Chưa có đồ ăn được đặt trước.</Text>
                )}
            </Modal>
        </Row>
    );
};

export default BookingPage;

