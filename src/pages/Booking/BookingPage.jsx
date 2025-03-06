import { App, Col, Form, Input, Row, Space, Typography } from 'antd';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { routeNames } from '../../constaints/routeName';
import { AuthContext } from '../../context/AuthContext';
import { useWindowSize } from '../../helpers/useWindowSize';
import axiosInstance from '../../service/axios';
import './BookingPage.css';
import FoodPreorderSection from './FoodPreOrderSection';
import FoodPreOrderSectionMobile from './FoodPreOrderSectionMobile';

const { Title, Text } = Typography;

const BookingPage = () => {
    const { t } = useTranslation('global');
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
            await axiosInstance.post(apiEndPoints.BOOKING_INFORMATION.CREATE, payload);
            message.success(t('booking.bookingPage.messages.success'));
            navigate(routeNames.index);
        } catch (error) {
            message.error(t('booking.bookingPage.messages.error'));
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
                        {t('booking.bookingPage.title') + ` ${selectedDate} ${selectedTime}`}
                    </Title>
                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        form={form}
                        onChange={handleFormChange}
                    >
                        <Form.Item
                            name="fullname"
                            label={t('booking.bookingPage.form.fullname.label')}
                            rules={[{ required: true, message: t('booking.bookingPage.form.fullname.required') }]}
                        >
                            <Input placeholder={t('booking.bookingPage.form.fullname.placeholder')} />
                        </Form.Item>

                        <Form.Item
                            name="numberOfPeople"
                            label={t('booking.bookingPage.form.numberOfPeople.label')}
                            rules={[{ required: true, message: t('booking.bookingPage.form.numberOfPeople.required') }]}
                        >
                            <Input
                                placeholder={t('booking.bookingPage.form.numberOfPeople.placeholder')}
                                type="number"
                                min={2}
                            />
                        </Form.Item>

                        <Form.Item
                            name="numberOfChildren"
                            label={t('booking.bookingPage.form.numberOfChildren.label')}
                        >
                            <Input
                                placeholder={t('booking.bookingPage.form.numberOfChildren.placeholder')}
                                type="number"
                            />
                        </Form.Item>

                        <Form.Item
                            name="phoneNumber"
                            label={t('booking.bookingPage.form.phoneNumber.label')}
                            rules={[
                                { required: true, message: t('booking.bookingPage.form.phoneNumber.required') },
                                { pattern: /^\d{9,10}$/, message: t('booking.bookingPage.form.phoneNumber.pattern') },
                            ]}
                        >
                            <Input placeholder={t('booking.bookingPage.form.phoneNumber.placeholder')} />
                        </Form.Item>

                        <Form.Item name="message" label={t('booking.bookingPage.form.message.label')}>
                            <Input.TextArea
                                placeholder={t('booking.bookingPage.form.message.placeholder')}
                                style={{ height: '100px' }}
                            />
                        </Form.Item>
                    </Form>
                    <Space direction="vertical" style={{ marginTop: '20px' }}>
                        <Text type="danger">
                            {t('booking.bookingPage.warnings.largeGroup')}
                            <a href="https://www.facebook.com/profile.php?id=61562738210745&mibextid=LQQJ4d">
                                {t('booking.bookingPage.warnings.fanpageLink')}
                            </a>
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