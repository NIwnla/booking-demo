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

const { Title, Text } = Typography;

const DeliveryCreationPage = () => {
    const [form] = Form.useForm();
    const { userId } = useContext(AuthContext);
    const [isFetching, setIsFetching] = useState(false);
    const { message } = App.useApp();

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
        console.log('Payload for API:', payload);

        setIsFetching(true);
        try {
            const response = await axiosInstance.post(apiEndPoints.DELIVERY_INFORMATION.CREATE, payload);
            message.success('Delivery created successfully');
            navigate(routeNames.index);
        } catch (error) {
            message.error(error.response.data);
        } finally {
            setIsFetching(false);
        }
    };

    const handlePreorder = (preorders) => {
        setPreorderedFoods(preorders);
        console.log('Preordered foods:', preorderedFoods.length);

    };
    const disabledDateTime = () => {
        const now = dayjs();
        return {
            disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter(hour => hour < now.hour()),
            disabledMinutes: (selectedHour) => {
                if (selectedHour === now.hour()) {
                    return Array.from({ length: 60 }, (_, i) => i).filter(minute => minute < now.minute());
                }
                return [];
            },
        };
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
                initialValues={{ time: dayjs().add(30, 'minutes') }}
            >
                <Form.Item
                    name="fullname"
                    label="Full Name"
                    rules={[{ required: true, message: 'Làm ơn nhập tên đầy đủ của bạn' }]}
                >
                    <Input placeholder="Tên đầy đủ" />
                </Form.Item>

                <Form.Item
                    name="time"
                    label="Time"
                    rules={[{ required: false, message: 'Vui lòng nhập thời gian giao hàng' }]}
                >
                    <TimePicker
                        placeholder="Thời gian"
                        format="HH:mm"
                        disabledTime={disabledDateTime}
                    />
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
                    <Input.TextArea placeholder="Thông tin chúng tôi cần lưu ý" className="text-area" />
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
                        items={[
                            {
                                key: '1',
                                label: 'Toggle Form',
                                children: renderForm(),
                            },
                        ]}
                    />
                </div>
            </Col>

            <Col xs={24}>
                <FoodDeliveryChosingSection onPreorder={handlePreorder} onFinish={onFinish} />
            </Col>

        </Row>
    );
};

export default DeliveryCreationPage;