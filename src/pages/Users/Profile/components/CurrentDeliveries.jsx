import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Descriptions, Empty, Row, Spin, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { AuthContext } from '../../../../context/AuthContext';
import axiosInstance from '../../../../service/axios';
import { apiEndPoints } from '../../../../constaints/apiEndPoint';
import { AxiosConstants } from '../../../../constaints/axiosContaint';
import { getLocalizedText } from '../../../../helpers/getLocalizedText';

const { Title, Paragraph, Text } = Typography;

const CurrentDeliveries = () => {
    const { t, i18n } = useTranslation('global');
    const currentLanguage = i18n.language;
    const { userId } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [delivery, setDelivery] = useState(null);

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const response = await axiosInstance.get(apiEndPoints.DELIVERY_INFORMATION.GET_CURRENT);
                setDelivery(response.data);
            } catch (error) {
                console.error('Error fetching current delivery:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveries();
    }, [userId]);

    const getStatusTag = (status) => {
        const statusMap = {
            0: { color: 'red', message: t('profile.deliveries.status.cancelled') },
            1: { color: 'orange', message: t('profile.deliveries.status.waiting') },
            2: { color: 'blue', message: t('profile.deliveries.status.inProgress') },
            3: { color: 'green', message: t('profile.deliveries.status.completed') },
        };
        const { color, message } = statusMap[status] || statusMap[0];
        return <Tag color={color}>{message}</Tag>;
    };

    const renderFoodItems = () => {
        if (!delivery?.food) return null;
        const { items, condiments, sustainableOptions } = JSON.parse(delivery.food);

        return (
            <>
                <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                    {items.map((item) => (
                        <Col key={item.cartItemKey} xs={24} sm={12} md={8}>
                            <Card
                                size="small"
                                cover={
                                    <img
                                        alt={getLocalizedText(item, 'name', currentLanguage)}
                                        src={`${AxiosConstants.AXIOS_BASEURL}/${item.imagePath}`}
                                        style={{ height: '120px', objectFit: 'cover' }}
                                    />
                                }
                                style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
                            >
                                <Card.Meta
                                    title={
                                        <Text ellipsis={{ tooltip: getLocalizedText(item, 'name', currentLanguage) }}>
                                            {getLocalizedText(item, 'name', currentLanguage)}
                                        </Text>
                                    }
                                    description={
                                        <div>
                                            <p>{item.basePrice.toLocaleString()} VND × {item.quantity}</p>
                                            {item.options && item.options.length > 0 && (
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    {item.options.map(option => (
                                                        <p key={option.id}>
                                                            + {getLocalizedText(option, 'name', currentLanguage)}
                                                            ({option.price.toLocaleString()} VND)
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                            <p style={{ fontWeight: 'bold', marginTop: '8px' }}>
                                                {t('delivery.management.modal.total')}: {item.total.toLocaleString()} VND
                                            </p>
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
                {(condiments?.length > 0 || sustainableOptions?.length > 0) && (
                    <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                        {condiments?.length > 0 && (
                            <div>
                                <Title level={5}>{t('delivery.management.modal.condiments')}</Title>
                                {condiments.map((item) => (
                                    <p key={item.id}>
                                        {t(`foodMenu.cart.condiments.${item.id}`)} × {item.quantity}
                                    </p>
                                ))}
                            </div>
                        )}
                        {sustainableOptions?.length > 0 && (
                            <div style={{ marginTop: condiments?.length ? '16px' : 0 }}>
                                <Title level={5}>{t('delivery.management.modal.sustainableOptions')}</Title>
                                {sustainableOptions.map((option) => (
                                    <p key={option}>
                                        {t(`foodMenu.cart.sustainableItems.${option}`)}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </>
        );
    };

    if (loading) return <Spin />;
    if (!delivery) return <Empty description={t('profile.deliveries.noCurrentDelivery')} />;

    return (
        <div>
            <Descriptions
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            >
                <Descriptions.Item label={t('delivery.management.modal.userFullName')}>
                    {delivery.userFullName}
                </Descriptions.Item>
                <Descriptions.Item label={t('delivery.management.modal.phoneNumber')}>
                    {delivery.phoneNumber}
                </Descriptions.Item>
                {delivery.recipientFullName && (
                    <>
                        <Descriptions.Item label={t('delivery.management.modal.recipientName')}>
                            {delivery.recipientFullName}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('delivery.management.modal.recipientPhone')}>
                            {delivery.recipientPhoneNumber}
                        </Descriptions.Item>
                    </>
                )}
                <Descriptions.Item label={t('delivery.management.modal.time')} span={2}>
                    {delivery.time ? dayjs(delivery.time).format('DD/MM/YYYY HH:mm') : ''}
                </Descriptions.Item>
                <Descriptions.Item label={t('delivery.management.modal.location')} span={2}>
                    {delivery.location}
                </Descriptions.Item>
                <Descriptions.Item label={t('delivery.management.modal.status')}>
                    {getStatusTag(delivery.deliveryStatus)}
                </Descriptions.Item>
                {delivery.message && (
                    <Descriptions.Item label={t('delivery.management.modal.message')} span={2}>
                        <Paragraph
                            ellipsis={{
                                rows: 2,
                                expandable: true,
                                symbol: t('delivery.management.modal.readMore')
                            }}
                            style={{ margin: 0 }}
                        >
                            {delivery.message}
                        </Paragraph>
                    </Descriptions.Item>
                )}
            </Descriptions>

            <Card style={{ marginTop: '16px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <Title level={5}>{t('profile.deliveries.order.summary')}</Title>
                    <div>
                        <p>{t('delivery.management.modal.subTotal')}: {delivery.subTotal.toLocaleString()} VND</p>
                        <p>{t('delivery.management.modal.shipping')}: {delivery.shippingCost.toLocaleString()} VND</p>
                        <p>{t('delivery.management.modal.tax')}: {delivery.tax.toLocaleString()} VND</p>
                        <p style={{ fontWeight: 'bold' }}>
                            {t('delivery.management.modal.total')}: {delivery.total.toLocaleString()} VND
                        </p>
                    </div>
                </div>
                {renderFoodItems()}
            </Card>
        </div>
    );
};

export default CurrentDeliveries;