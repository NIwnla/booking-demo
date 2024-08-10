import React, { useState } from 'react';
import { Form, Input, Select, Button, Typography, Space, Checkbox } from 'antd';
import { useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const Booking = () => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const location = useLocation();
    const { selectedDate } = location?.state;

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    const handleCheckboxChange = (e) => {
        setIsConfirmed(e.target.checked);
    };

    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>Thông tin book vào {selectedDate}</Title>
            <Form
                layout="vertical"
                onFinish={onFinish}
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
                    <Select placeholder="Chọn số người dùng bàn" >
                        <Select.Option value={2}  > 2</Select.Option>
                        <Select.Option value={3}  > 3</Select.Option>
                        <Select.Option value={4}  > 4</Select.Option>
                        <Select.Option value={5}  > 5</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại của bạn' }]}
                >
                    <Input placeholder="Số điện thoại" />
                </Form.Item>
                <Text type='warning'>
                    Quý khách vui lòng đến đúng giờ, nhà sẽ chỉ giữ bàn muộn hơn 10 phút so với giờ đặt bàn nhé!
                </Text>
                <Form.Item>
                    <Checkbox onChange={handleCheckboxChange}>
                        Tôi xác nhận là sẽ đến đúng giờ.
                    </Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block disabled={!isConfirmed}>
                        Book Now
                    </Button>
                </Form.Item>
            </Form>
            <Space direction="vertical" style={{ marginTop: '24px', textAlign: 'center' }}>
                <Text type="danger">Đối với bàn 6 trở lên người vui lòng nhắn tin qua Fanpage để được hỗ trợ:&nbsp;
                    <a href='https://www.facebook.com/profile.php?id=61562738210745&mibextid=LQQJ4d'>
                        Fanpage
                    </a></Text>
            </Space>
        </div>
    );
};

export default Booking;
