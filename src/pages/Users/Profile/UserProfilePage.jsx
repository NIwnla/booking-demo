import { Card, Divider, Tabs, Typography } from 'antd';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../context/AuthContext';
import CurrentDeliveries from './components/CurrentDeliveries';
import CurrentReservations from './components/CurrentReservations';
import { EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import HistoryDeliveries from './components/HistoryDeliveries';
import HistoryReservations from './components/HistoryReservations';

const { Title, Text, Paragraph } = Typography;

const UserProfilePage = () => {
    const { t } = useTranslation('global');
    const { email } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('current_deliveries');

    const items = [
        {
            key: 'current_deliveries',
            label: t('profile.tabs.currentDeliveries'),
            children: <CurrentDeliveries />,
        },
        {
            key: 'current_reservations',
            label: t('profile.tabs.currentReservations'),
            children: <CurrentReservations />,
        },
        {
            key: 'delivery_history',
            label: t('profile.tabs.deliveryHistory'),
            children: <HistoryDeliveries />,
        },
        {
            key: 'reservation_history',
            label: t('profile.tabs.reservationHistory'),
            children: <HistoryReservations />,
        },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <div style={{ padding: '5vh 10vw' }}>
                <Card style={{ marginBottom: '24px' }}>
                    <Typography.Text type="secondary">
                        {t('profile.email')}: {email}
                    </Typography.Text>
                </Card>

                <Card>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={items}
                        size="large"
                        type="card"
                    />
                </Card>

                <Card style={{ marginTop: '24px' }}>
                    <Title level={5}>{t('profile.help.title')}</Title>
                    <Divider />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <Text strong style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <PhoneOutlined /> {t('profile.help.hotline')}
                            </Text>
                            <Paragraph style={{ margin: '4px 0 0 24px' }}>
                                1900 1234
                            </Paragraph>
                        </div>
                        <div>
                            <Text strong style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MailOutlined /> {t('profile.help.email')}
                            </Text>
                            <Paragraph style={{ margin: '4px 0 0 24px' }}>
                                support@restaurant.com
                            </Paragraph>
                        </div>
                        <div>
                            <Text strong style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <EnvironmentOutlined /> {t('profile.help.address')}
                            </Text>
                            <Paragraph style={{ margin: '4px 0 0 24px' }}>
                                123 Restaurant Street, District 1, Ho Chi Minh City
                            </Paragraph>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default UserProfilePage;