import React from 'react';
import { Form, Input, InputNumber, Button, Typography, Space } from 'antd';
import { useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const Booking = () => {
    const location = useLocation();
    const { selectedDate } = location?.state;

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>Your booking information in {selectedDate}</Title>
            <Form
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="fullname"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter your full name' }]}
                >
                    <Input placeholder="Enter your full name" />
                </Form.Item>

                <Form.Item
                    name="numberOfPeople"
                    label="Number of People"
                    rules={[
                        { required: true, message: 'Please enter the number of people' },
                        { type: 'number', min: 1, message: 'Must be at least 1 person' }
                    ]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter number of people" />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                >
                    <Input placeholder="Enter your phone number" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Book Now
                    </Button>
                </Form.Item>
            </Form>
            <Space direction="vertical" style={{ marginTop: '24px', textAlign: 'center' }}>
                <Text type="danger">* Note or something note-worthy here</Text>
            </Space>
        </div>
    );
};

export default Booking;
