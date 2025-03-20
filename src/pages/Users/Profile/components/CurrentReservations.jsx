import React, { useContext, useEffect, useState } from 'react';
import { Card, Descriptions, Empty, Spin, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { AuthContext } from '../../../../context/AuthContext';
import axiosInstance from '../../../../service/axios';
import { apiEndPoints } from '../../../../constaints/apiEndPoint';

const { Title, Text } = Typography;

const CurrentReservations = () => {
    const { t, i18n } = useTranslation('global');
    const currentLanguage = i18n.language;
    const { userId } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [reservation, setReservation] = useState(null);
    const [totalGuest, setTotalGuest] = useState(0);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axiosInstance.get(apiEndPoints.BOOKING_INFORMATION.GET_CURRENT_BOOKING);
                setReservation(response.data);
                setTotalGuest(response.data.adult + response.data.peopleOver60 + response.data.peopleUnder6);
            } catch (error) {
                console.error('Error fetching current reservation:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [userId]);

    const getStatusTag = (status) => {
        const statusMap = {
            0: { color: 'red', message: t('profile.reservations.status.cancelled') },
            1: { color: 'orange', message: t('profile.reservations.status.pending') },
            2: { color: 'blue', message: t('profile.reservations.status.confirmed') },
            3: { color: 'green', message: t('profile.reservations.status.completed') },
        };
        const { color, message } = statusMap[status] || statusMap[0];
        return <Tag color={color}>{message}</Tag>;
    };

    if (loading) return <Spin />;
    if (!reservation) return <Empty description={t('profile.reservations.noCurrentReservation')} />;


    return (
        <div>
            <Descriptions
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            >
                <Descriptions.Item label={t('profile.reservations.form.fullName')}>
                    {reservation.userFullName}
                </Descriptions.Item>
                <Descriptions.Item label={t('profile.reservations.form.email')}>
                    {reservation.email}
                </Descriptions.Item>
                <Descriptions.Item label={t('profile.reservations.form.phoneNumber')}>
                    {reservation.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item label={t('profile.reservations.form.branch')}>
                    {currentLanguage === 'en' ? reservation.branchNameEN : reservation.branchNameVN}
                </Descriptions.Item>
                <Descriptions.Item label={t('profile.reservations.form.dateTime')} span={2}>
                    {dayjs(reservation.time).format('DD/MM/YYYY HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label={t('profile.reservations.form.adult')}>
                    {reservation.adult}
                </Descriptions.Item>
                <Descriptions.Item label={t('profile.reservations.form.peopleOver60')}>
                    {reservation.peopleOver60}
                </Descriptions.Item>
                <Descriptions.Item label={t('profile.reservations.form.peopleUnder6')}>
                    {reservation.peopleUnder6}
                </Descriptions.Item>
                <Descriptions.Item label={t('profile.reservations.form.totalGuests')}>
                    {totalGuest}
                </Descriptions.Item>
                <Descriptions.Item label={t('profile.reservations.form.status')}>
                    {getStatusTag(reservation.bookingStatus)}
                </Descriptions.Item>
                <Descriptions.Item label={t('profile.reservations.form.smsNotification')}>
                    {reservation.smsNotification ? t('profile.reservations.common.yes') : t('profile.reservations.common.no')}
                </Descriptions.Item>
            </Descriptions>

            {reservation.restaurantNotes && reservation.restaurantNotes.trim() !== '' && (
                <Card style={{ marginTop: '16px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
                    <div style={{ marginTop: '16px' }}>
                        <Title level={5}>{t('profile.reservations.form.notes')}</Title>
                        <Text>{reservation.restaurantNotes}</Text>
                    </div>
                </Card>
            )}

        </div>
    );
};

export default CurrentReservations;