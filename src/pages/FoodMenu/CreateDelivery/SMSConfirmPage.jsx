import { App, Button, Card, Descriptions, Divider, Form, Input, Space, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import { routeNames } from '../../../constaints/routeName';
import { DeliveryContext } from '../../../context/DeliveryContext';
import axiosInstance from '../../../service/axios';
import { getLocalizedText } from './../../../helpers/getLocalizedText';
import { AuthContext } from '../../../context/AuthContext';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const SMSConfirmPage = () => {
    const { t, i18n } = useTranslation('global');
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { cart, location: deliveryLocation, deliveryTime,setDeliveryTime ,clearCart, condiments, sustainableOptions} = useContext(DeliveryContext);
    const {userId} = useContext(AuthContext);
    const orderInfo = location.state?.orderInfo || {};
    const { message } = App.useApp();

    const total = cart.reduce((sum, item) => sum + item.total, 0);
    const shippingCost = total > 50000 ? 0 : 5000;
    const tax = Math.round(total * 0.1);
    const finalTotal = total + shippingCost + tax;

    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const deliveryData = {
                userId: userId,
                time: deliveryTime || dayjs().add(1,'hour').format('DD/MM/YYYY HH:mm'),
                userFullName: orderInfo.name,
                recipientFullName: orderInfo.recipientName,
                location: deliveryLocation.formattedAddress,
                phoneNumber: orderInfo.phone,
                recipientPhoneNumber: orderInfo.recipientPhone,
                subTotal: total,
                shippingCost,
                tax,
                total: finalTotal,
                food: JSON.stringify({
                    items: cart,
                    condiments: Object.entries(condiments)
                        .filter(([_, data]) => data.checked)
                        .map(([id, data]) => ({
                            id,
                            quantity: data.quantity
                        })),
                    sustainableOptions: Object.entries(sustainableOptions)
                        .filter(([_, data]) => data.checked)
                        .map(([id]) => id)
                }),
                message: orderInfo.note || ''
            };

            await axiosInstance.post(apiEndPoints.DELIVERY_INFORMATION.CREATE, deliveryData);
            message.success(t('foodMenu.sms.confirm.success'));
            setDeliveryTime(null);
            clearCart();
            navigate(routeNames.foodMenu.main);
        } catch (error) {
            message.error(t('foodMenu.sms.confirm.error'));
            console.error('Error creating delivery:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: isLargeScreen ? 'center' : 'flex-start',
            backgroundColor: '#f5f5f5',
            padding: isLargeScreen ? '10vh 10vw' : '5px 2vw'
        }}>
            <Card style={{
                width: '100%',
                maxWidth: isLargeScreen ? 1000 : '100%',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
                <Space direction="vertical" size={isLargeScreen ? "large" : "middle"} style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Title level={3}>{t('foodMenu.sms.confirm.title')}</Title>
                        <Text type="secondary">
                            {t('foodMenu.sms.confirm.description')}
                        </Text>
                    </div>

                    <Descriptions
                        title={t('foodMenu.sms.confirm.orderSummary')}
                        bordered
                        column={1}
                        size={isLargeScreen ? "default" : "small"}
                        layout={isLargeScreen ? "horizontal" : "vertical"}
                    >
                        <Descriptions.Item label={t('foodMenu.orderInformation.yourName')}>
                            {orderInfo.name}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('foodMenu.orderInformation.phoneNumber')}>
                            {orderInfo.phone}
                        </Descriptions.Item>
                        {orderInfo.recipientName && (
                            <>
                                <Descriptions.Item label={t('foodMenu.orderInformation.recipientName')}>
                                    {orderInfo.recipientName}
                                </Descriptions.Item>
                                <Descriptions.Item label={t('foodMenu.orderInformation.recipientPhoneNumber')}>
                                    {orderInfo.recipientPhone}
                                </Descriptions.Item>
                            </>
                        )}
                        <Descriptions.Item label={t('foodMenu.orderSummary.location')}>
                            {deliveryLocation?.formattedAddress}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('foodMenu.orderSummary.deliveryTime')}>
                            {deliveryTime ? dayjs(deliveryTime).format('DD/MM/YYYY HH:mm') : dayjs().add(1,'hour').format('DD/MM/YYYY HH:mm')}
                        </Descriptions.Item>
                        {orderInfo.note && (
                            <Descriptions.Item label={t('foodMenu.orderInformation.note')}>
                                {orderInfo.note}
                            </Descriptions.Item>
                        )}
                    </Descriptions>

                    <Divider style={{margin: '20px 0',borderWidth: 2,borderColor: '#d9d9d9'}} />

                    <Descriptions
                        title={t('foodMenu.sms.confirm.orderDetails')}
                        bordered
                        column={1}
                        size={isLargeScreen ? "default" : "small"}
                        layout={isLargeScreen ? "horizontal" : "vertical"}
                    >
                        {cart.map((item) => (
                            <Descriptions.Item
                                key={item.cartItemKey}
                                label={
                                    <div>
                                        <div style={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: isLargeScreen ? '400px' : '200px'
                                        }}>
                                            {getLocalizedText(item, 'name', i18n.language)} x {item.quantity}
                                        </div>
                                        {item.options && item.options.length > 0 && (
                                            <div style={{
                                                fontSize: '0.85em',
                                                color: '#666',
                                                paddingLeft: '1em'
                                            }}>
                                                {item.options.map(option => (
                                                    <div
                                                        key={option.id}
                                                        style={{
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: isLargeScreen ? '380px' : '180px'
                                                        }}
                                                    >
                                                        + {getLocalizedText(option, 'name', i18n.language)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                }
                            >
                                {item.total.toLocaleString()} VND
                            </Descriptions.Item>
                        ))}
                        <Descriptions.Item label={t('foodMenu.orderSummary.subTotal')}>
                            {total.toLocaleString()} VND
                        </Descriptions.Item>
                        <Descriptions.Item label={t('foodMenu.orderSummary.shipping')}>
                            {shippingCost > 0 ? `${shippingCost.toLocaleString()} VND` : t('foodMenu.orderSummary.freeShipping')}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('foodMenu.orderSummary.tax')}>
                            {tax.toLocaleString()} VND
                        </Descriptions.Item>
                        <Descriptions.Item label={t('foodMenu.orderSummary.total')}>
                            <Text strong>{finalTotal.toLocaleString()} VND</Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Form
                        form={form}
                        layout="vertical"
                        style={{ width: '100%' }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="smsCode"
                            rules={[
                                { required: true, message: t('foodMenu.sms.confirm.codeRequired') },
                                {
                                    pattern: /^\d{8}$/,
                                    message: t('foodMenu.sms.confirm.invalidCode')
                                }
                            ]}
                        >
                            <Input
                                size="large"
                                maxLength={8}
                                placeholder="12345678"
                                style={{ textAlign: 'center', letterSpacing: '0.5em' }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                size="large"
                            >
                                {t('foodMenu.sms.confirm.verifyButton')}
                            </Button>
                        </Form.Item>
                    </Form>

                    <div style={{ textAlign: 'center' }}>
                        <Button type="link">
                            {t('foodMenu.sms.confirm.resendCode')}
                        </Button>
                    </div>
                </Space>
            </Card>
        </div>
    );
};

export default SMSConfirmPage;