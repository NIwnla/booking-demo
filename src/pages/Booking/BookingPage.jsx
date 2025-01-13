import { App, Button, Card, Checkbox, Col, Collapse, Form, Image, Input, Modal, Row, Space, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { routeNames } from '../../constaints/routeName';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../service/axios';
import './BookingPage.css';
import FoodPreorderSection from './FoodPreOrderSection';
import { useWindowSize } from '../../helpers/useWindowSize';
import FoodPreOrderSectionMobile from './FoodPreOrderSectionMobile';

const { Title, Text } = Typography;

const BookingPage = () => {
    const [form] = Form.useForm();
    const location = useLocation();
    const { selectedDate, selectedTime, branchId } = location?.state;
    const { userId } = useContext(AuthContext);
    const [isFetching, setIsFetching] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const { message } = App.useApp();

    const windowSize = useWindowSize();
    const navigate = useNavigate();

    const [preorderedFoods, setPreorderedFoods] = useState([]);

    const onFinish = async () => {
        const time = `${selectedDate}T${selectedTime}:00.000Z`;
        const values = await form.validateFields();
        const preorder =
            preorderedFoods && Object.keys(preorderedFoods).length > 0
                ? Object.entries(preorderedFoods)
                    .map(([foodId, { quantity }]) => `[${foodId}: ${quantity}]`)
                    .join(', ')
                : undefined;

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

        setIsFetching(true);
        try {
            const response = await axiosInstance.post(apiEndPoints.BOOKING_INFORMATION.CREATE, payload);
            message.success('Booked successfully');
            navigate(routeNames.index);
        } catch (error) {
            message.error(error.response.data);
        } finally {
            setIsFetching(false);
        }
    };

    const handlePreorder = (preorderFoods) => {
        setPreorderedFoods(preorderFoods);
    };

    const handleFormChange = async () => {
        try {
            await form.validateFields();
            setIsFormValid(true);
        } catch (error) {
            setIsFormValid(false);
        }
    };

    return (
        <Row gutter={24}>
            <Col xs={24}>
                <div
                    style={{
                        padding: '24px',
                        background: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Title level={3} style={{ color: '#ff4d4f' }}>
                        Thông tin book vào {selectedDate} {selectedTime}
                    </Title>
                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        form={form}
                        onChange={handleFormChange}
                    >
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
                            rules={[{ required: true, message: 'Làm ơn chọn số người dùng bàn' }]}
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
                            <Input.TextArea
                                placeholder="Message (Optional)"
                                style={{ height: '100px' }}
                            />
                        </Form.Item>
                    </Form>
                    <Space direction="vertical" style={{ marginTop: '20px' }}>
                        <Text type="danger">
                            Đối với bàn 6 trở lên người vui lòng nhắn tin qua Fanpage để được hỗ trợ:&nbsp;
                            <a href="https://www.facebook.com/profile.php?id=61562738210745&mibextid=LQQJ4d">Fanpage</a>
                        </Text>
                    </Space>
                </div>
            </Col>

            <Col xs={24}>
                {windowSize.width > 768 ? (
                    <FoodPreorderSection
                        onPreorder={handlePreorder}
                        onFinish={onFinish}
                        isFormValid={isFormValid}
                    />
                ) : (
                    <FoodPreOrderSectionMobile
                        onPreorder={handlePreorder}
                        onFinish={onFinish}
                        isFormValid={isFormValid}
                    />
                )}
            </Col>
        </Row>
    );
};

export default BookingPage;
