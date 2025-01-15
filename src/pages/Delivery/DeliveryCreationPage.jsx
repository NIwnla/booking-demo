import { App, Col, Form, Input, Row, TimePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { routeNames } from '../../constaints/routeName';
import { AuthContext } from '../../context/AuthContext';
import { useWindowSize } from '../../helpers/useWindowSize';
import axiosInstance from '../../service/axios';
import './DeliveryCreationPage.css';
import FoodDeliveryChosingSection from './FoodDeliveryChosingSection';
import FoodDeliveryChosingSectionMobile from './FoodDeliveryChosingSectionMobile';

const { Title, Text } = Typography;

const DeliveryCreationPage = () => {
    const [form] = Form.useForm();
    const { userId } = useContext(AuthContext);
    const [isFetching, setIsFetching] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const { message } = App.useApp();

    const windowSize = useWindowSize();
    const navigate = useNavigate();

    const [preorderedFoods, setPreorderedFoods] = useState([]);

    const {t} = useTranslation("global");

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
            message.success(t('delivery.form.messageDeliverySuccess'));
            navigate(routeNames.index);
        } catch (error) {
            message.error(t('delivery.form.messageDeliveryError'));
        } finally {
            setIsFetching(false);
        }
    };

    const handlePreorder = (preorders) => {
        setPreorderedFoods(preorders);
    };

    const handleFormChange = async () => {
        try {
            await form.validateFields(); // Check if all fields are valid
            setIsFormValid(true);
        } catch (error) {
            setIsFormValid(false);
        }
    };

    return (
        <Row gutter={24}>
            <Col xs={24}>
                <div className="form-container">
                    <Title level={3} className="form-title">
                        {t('delivery.form.title')}
                    </Title>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        onChange={handleFormChange}
                    >
                        <Form.Item
                            name="fullname"
                            label={t('delivery.form.fullname')}
                            rules={[{ required: true, message: t('delivery.form.fullnameRequired') }]}
                        >
                            <Input placeholder={t('delivery.form.fullnamePlaceholder')} />
                        </Form.Item>

                        <Form.Item
                            name="time"
                            label="Thời gian"
                            rules={[{ required: false, message: t('delivery.form.timeRequired') }]}
                            extra={t('delivery.form.timeExtra')}
                        >
                            <TimePicker
                                placeholder={t('delivery.form.timePlaceholder')}
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
                            label={t('delivery.form.location')}
                            rules={[{ required: true, message: t('delivery.form.locationRequired') }]}>
                            <Input placeholder={t('delivery.form.locationPlaceholder')} />
                        </Form.Item>

                        <Form.Item
                            name="phoneNumber"
                            label={t('delivery.form.phoneNumber')}
                            rules={[
                                { required: true, message: t('delivery.form.phoneNumberRequired') },
                                { pattern: /^\d{9,10}$/, message: t('delivery.form.phoneNumberPattern') }
                            ]}>
                            <Input placeholder={t('delivery.form.phoneNumberPlaceholder')} />
                        </Form.Item>

                        <Form.Item name="message" label={t('delivery.form.message')}>
                            <Input.TextArea placeholder={t('delivery.form.messagePlaceholder')} className="text-area" />
                        </Form.Item>
                    </Form>
                </div>
            </Col>
                        
            <Col xs={24}>
                {windowSize.width > 768 ? (
                    <FoodDeliveryChosingSection
                        onPreorder={handlePreorder}
                        onFinish={onFinish}
                        isFormValid={isFormValid}
                    />
                ) : (
                    <FoodDeliveryChosingSectionMobile
                        onPreorder={handlePreorder}
                        onFinish={onFinish}
                        isFormValid={isFormValid}
                    />
                )}
            </Col>
        </Row>
    );
};

export default DeliveryCreationPage;
