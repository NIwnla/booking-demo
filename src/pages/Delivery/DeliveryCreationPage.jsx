import { PlusCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Collapse, Form, Image, Input, Modal, Row, Space, Typography } from 'antd';
import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { routeNames } from '../../constaints/routeName';
import { AuthContext } from '../../context/AuthContext';
import { showMessage } from '../../helpers/showMessage';
import axiosInstance from '../../service/axios';
import './DeliveryCreationPage.css';
import FoodPreorderSection from '../Booking/FoodPreOrderSection';

const { Title, Text } = Typography;

const DeliveryCreationPage = () => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const { userId } = useContext(AuthContext);
    const [isFetching, setIsFetching] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeKey, setActiveKey] = useState(null);

    const navigate = useNavigate();

    const [preorderedFoods, setPreorderedFoods] = useState([]);

    const onFinish = async (values) => {

        const preorder = preorderedFoods && preorderedFoods.length > 0
            ? preorderedFoods.map(food => `[${food.id}${food.isOption ? ' - option' : ''}: ${food.quantity}]`).join(', ') : undefined;

        const payload = {
            userId,
            userFullName: values.fullname,
            location: values.location,
            phoneNumber: values.phoneNumber,
            message: values.message || undefined,
            preorder,
        };

        console.log('Payload for API:', payload);

        setIsFetching(true);
        try {
            const response = await axiosInstance.post(apiEndPoints.DELIVERY_INFORMATION.CREATE, payload);
            showMessage("success", 'Delivery created successfully');
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

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleCollapseChange = (key) => {
        setActiveKey(key);
    };

    const renderForm = () => (
        <>
            <Title level={3} className="form-title">
                Thông tin giao hàng
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
                    name="location"
                    label="Location"
                    rules={[{ required: true, message: 'Làm ơn nhập địa chỉ giao hàng' }]}
                >
                    <Input placeholder="Địa chỉ giao hàng" />
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
                    <Input.TextArea placeholder="Message (Optional)" className="text-area" />
                </Form.Item>

                <Text type="warning">
                    Quý khách vui lòng có mặt tại địa chỉ giao hàng đúng giờ!
                </Text>

                <Form.Item>
                    <Checkbox onChange={handleCheckboxChange}>Tôi xác nhận là sẽ có mặt đúng giờ.</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block disabled={!isConfirmed} loading={isFetching}>
                        Create Delivery
                    </Button>
                </Form.Item>
            </Form>
            <Space direction="vertical" className="fanpage-message">
                <Text type="danger">
                    Đối với đơn hàng lớn vui lòng nhắn tin qua Fanpage để được hỗ trợ:&nbsp;
                    <a href="https://www.facebook.com/profile.php?id=61562738210745&mibextid=LQQJ4d">Fanpage</a>
                </Text>
            </Space>
        </>
    );

    return (
        <Row gutter={24}>
            <Col xs={24}>
                <div className="form-container">
                    <Collapse
                        activeKey={activeKey}
                        onChange={handleCollapseChange}
                        items={[
                            {
                                key: '1',
                                label: activeKey ? 'Hide Form' : 'Show Form',
                                children: renderForm(),
                            },
                        ]}
                    />
                </div>
            </Col>

            <Col xs={24} className="preorder-food-section">
                <div className="preorder-section">
                    <Title level={4} className="preorder-title">Đồ ăn đặt trước</Title>
                    <div className="scrollable-content">
                        <Row>
                            {preorderedFoods.length > 0 ? (
                                preorderedFoods.map((food, index) => (
                                    <Col xs={12} xl={8} key={index}>
                                        <Card key={index} className="food-card">
                                            <Row align="middle" gutter={16}>
                                                <Col span={8}>
                                                    <Image
                                                        src={`${axiosInstance.defaults.baseURL}/${food.imagePath}`}
                                                        alt={food.name}
                                                        className="food-image"
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
                                                            className="remove-button"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Space>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Text type="secondary">Chưa có đồ ăn được đặt trước.</Text>
                            )}
                        </Row>
                    </div>
                </div>
            </Col>

            <Col xs={24}>
                <FoodPreorderSection onPreorder={handlePreorder} />
            </Col>

            <Button
                type="primary"
                icon={<PlusCircleFilled />}
                className="floating-button"
                onClick={showModal}
            >
                Xem đồ ăn đặt trước
            </Button>

            <Modal
                title="Preordered Food"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <div className="scrollable-content">
                    {preorderedFoods.length > 0 ? (
                        preorderedFoods.map((food, index) => (
                            <Card key={index} className="food-card">
                                <Row align="middle" style={{ width: '100%' }} gutter={16}>
                                    <Col span={8}>
                                        <Image
                                            src={`${axiosInstance.defaults.baseURL}/${food.imagePath}`}
                                            alt={food.name}
                                            className="food-image"
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
                                                className="remove-button"
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
            </Modal>
        </Row>
    );
};

export default DeliveryCreationPage;