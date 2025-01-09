import { App, Button, Card, Checkbox, Col, Collapse, Form, Image, Input, Modal, Row, Space, Typography } from 'antd';
import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { routeNames } from '../../constaints/routeName';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../service/axios';
import './BookingPage.css';
import FoodPreorderSection from './FoodPreOrderSection';

const { Title, Text } = Typography;

const BookingPage = () => {
    const [form] = Form.useForm();
    const location = useLocation();
    const { selectedDate, selectedTime, branchId } = location?.state;
    const { userId } = useContext(AuthContext);
    const [isFetching, setIsFetching] = useState(false);
    // @ts-ignore
    const { message } = App.useApp();

    const navigate = useNavigate();

    const [preorderedFoods, setPreorderedFoods] = useState([]);

    const onFinish = async () => {
        const time = `${selectedDate}T${selectedTime}:00.000Z`;
        const values = await form.validateFields(); // Validate and get form values
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

        console.log('Payload for API:', payload);

        setIsFetching(true);
        try {
            // @ts-ignore
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


    const renderForm = () => (
        <>
            <Title level={3} style={styles.formTitle}>
                Thông tin book vào {selectedDate} {selectedTime}
            </Title>
            <Form
                layout="vertical"
                onFinish={onFinish}
                form={form}
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
                    <Input.TextArea placeholder="Message (Optional)" style={styles.textArea} />
                </Form.Item>
            </Form>
            <Space direction="vertical" style={styles.fanpageMessage}>
                <Text type="danger">
                    Đối với bàn 6 trở lên người vui lòng nhắn tin qua Fanpage để được hỗ trợ:&nbsp;
                    <a href="https://www.facebook.com/profile.php?id=61562738210745&mibextid=LQQJ4d">Fanpage</a>
                </Text>
            </Space>
        </>
    );

    return (
        <Row gutter={24}>
            <Col xs={24}>
                <div style={styles.formContainer}>
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
                <FoodPreorderSection onPreorder={handlePreorder} onFinish={onFinish} />
            </Col>

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
        color: '#ff4d4f',
    },
    textArea: {
        height: '100px',
    },
    fanpageMessage: {
        marginTop: '20px',
    },
    preorderSection: {
        marginTop: '24px',
        padding: '24px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    preorderTitle: {
        color: '#ff4d4f',
    },
    scrollableContent: {
        maxHeight: '65vh',
        overflowY: 'auto',
    },
    foodCard: {
        marginBottom: '16px',
        width: '100%',
    },
    foodImage: {
        width: '100%',
        height: 'auto',
        objectFit: 'cover',
    },
    removeButton: {
        color: '#ff4d4f',
        padding: '0',
    },
    floatingButton: {
        position: 'fixed',
        bottom: '16px',
        right: '16px',
    },
};

export default BookingPage;
