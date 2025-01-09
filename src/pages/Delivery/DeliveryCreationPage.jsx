import { App, Col, Collapse, Form, Input, Row, Space, TimePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { routeNames } from '../../constaints/routeName';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../service/axios';
import './DeliveryCreationPage.css';
import FoodDeliveryChosingSection from './FoodDeliveryChosingSection';
import FoodDeliveryChosingSectionMobile from './FoodDeliveryChosingSectionMobile';
import { useWindowSize } from '../../helpers/useWindowSize';

const { Title, Text } = Typography;

const DeliveryCreationPage = () => {
    const [form] = Form.useForm();
    const { userId } = useContext(AuthContext);
    const [isFetching, setIsFetching] = useState(false);
    const { message } = App.useApp();

    const windowSize = useWindowSize();
    const navigate = useNavigate();

    const [preorderedFoods, setPreorderedFoods] = useState([]);

    const onFinish = async () => {
        const values = await form.validateFields(); // Validate and get form values
        const preorder =
            preorderedFoods && Object.keys(preorderedFoods).length > 0
                ? Object.entries(preorderedFoods)
                    .map(([foodId, { quantity }]) => `[${foodId}: ${quantity}]`)
                    .join(', ')
                : undefined;

        const payload = {
            userId,
            time: values.time ? values.time.format("YYYY-MM-DDTHH:mm:ss.sssZ") : undefined,
            userFullName: values.fullname,
            location: values.location,
            phoneNumber: values.phoneNumber,
            message: values.message || undefined,
            food: preorder,
        };

        setIsFetching(true);
        try {
            const response = await axiosInstance.post(apiEndPoints.DELIVERY_INFORMATION.CREATE, payload);
            message.success('Tạo đơn giao hàng thành công');
            navigate(routeNames.index);
        } catch (error) {
            message.error(error.response.data);
        } finally {
            setIsFetching(false);
        }
    };

    const handlePreorder = (preorders) => {
        setPreorderedFoods(preorders);
    };
    const renderForm = () => (
        <>
            <Title level={3} className="form-title">
                Thông tin giao hàng
            </Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="fullname"
                    label="Họ và Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn' }]}
                >
                    <Input placeholder="Họ và tên" />
                </Form.Item>

                <Form.Item
                    name="time"
                    label="Thời gian"
                    rules={[{ required: false, message: 'Vui lòng nhập thời gian giao hàng' }]}
                    extra="Nếu không chọn, chúng tôi sẽ mặc định giao hàng ngay khi có thể."
                >
                    <TimePicker
                        placeholder="ASAP"
                        format="HH:mm"
                        showNow={false}
                        disabledTime={() => {
                            const now = dayjs();
                            const currentHour = now.hour();
                            const currentMinute = now.minute();
                            const minutesOffset = (currentMinute + 30) % 60; // Minutes 30 minutes from now
                            const hoursOffset = (currentMinute + 30) >= 60 ? currentHour + 1 : currentHour;

                            return {
                                disabledHours: () =>
                                    Array.from({ length: 24 }, (_, hour) => hour).filter(hour => hour < hoursOffset),
                                disabledMinutes: (selectedHour) => {
                                    if (selectedHour === hoursOffset) {
                                        return Array.from({ length: 60 }, (_, minute) => minute).filter(minute => minute < minutesOffset);
                                    }
                                    return [];
                                },
                            };
                        }}
                    />
                </Form.Item>


                <Form.Item
                    name="location"
                    label="Địa chỉ"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng' }]}
                >
                    <Input placeholder="Địa chỉ giao hàng" />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại của bạn' },
                        { pattern: /^\d{9,10}$/, message: 'Số điện thoại phải có từ 9 đến 10 chữ số' }
                    ]}
                >
                    <Input placeholder="Số điện thoại" />
                </Form.Item>

                <Form.Item name="message" label="Lời nhắn">
                    <Input.TextArea placeholder="Thông tin cần lưu ý" className="text-area" />
                </Form.Item>
            </Form>
        </>
    );

    return (
        <Row gutter={24}>
            <Col xs={24}>
                <div className="form-container">
                    <Collapse
                        items={[
                            {
                                key: '1',
                                label: 'Mở/Đóng biểu mẫu',
                                children: renderForm(),
                            },
                        ]}
                    />
                </div>
            </Col>
                        
            <Col xs={24}>
                {windowSize.width > 768 ? (
                    <FoodDeliveryChosingSection
                        onPreorder={handlePreorder}
                        onFinish={onFinish}
                    />
                ) : (
                    <FoodDeliveryChosingSectionMobile
                        onPreorder={handlePreorder}
                        onFinish={onFinish}
                    />
                )}
            </Col>
        </Row>
    );
};

export default DeliveryCreationPage;
