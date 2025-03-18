import React from 'react';
import { Modal, Button, Spin, Typography, Row, Col, Card, Descriptions, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { AxiosConstants } from '../../../constaints/axiosContaint';
import { getLocalizedText } from '../../../helpers/getLocalizedText';

const { Title } = Typography;

const BookingDetailsModal = ({
    isVisible,
    onClose,
    loading,
    booking,
    windowSize
}) => {
    const { t, i18n } = useTranslation("global");

    const getStatusColor = (status) => {
        switch (status) {
            case 0: return 'error';
            case 1: return 'processing';
            case 2: return 'success';
            default: return 'default';
        }
    };

    return (
        <Modal
            title={t('booking.bookingManagement.titles.modalTitle')}
            open={isVisible}
            onCancel={onClose}
            width={windowSize.width < 768 ? '100%' : '70vw'}
            footer={[
                <Button key="close" onClick={onClose}>
                    {t('booking.bookingManagement.buttons.close')}
                </Button>,
            ]}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                </div>
            ) : booking && (
                <Card>
                    <Descriptions
                        bordered
                        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                    >
                        <Descriptions.Item 
                            label={t('booking.bookingManagement.modal.fields.status')}
                            span={2}
                        >
                            <Tag color={getStatusColor(booking.bookingStatus)}>
                                {booking.bookingStatus === 0
                                    ? t('booking.bookingManagement.statuses.cancelled')
                                    : booking.bookingStatus === 1
                                        ? t('booking.bookingManagement.statuses.pending')
                                        : t('booking.bookingManagement.statuses.confirmed')}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item 
                            label={t('booking.bookingManagement.modal.fields.userFullName')}
                        >
                            {booking.userFullName}
                        </Descriptions.Item>

                        <Descriptions.Item 
                            label={t('booking.bookingManagement.modal.fields.email')}
                        >
                            {booking.email}
                        </Descriptions.Item>

                        <Descriptions.Item 
                            label={t('booking.bookingManagement.modal.fields.branchName')}
                        >
                            {getLocalizedText(booking, 'branchName', i18n.language)}
                        </Descriptions.Item>

                        <Descriptions.Item 
                            label={t('booking.bookingManagement.modal.fields.time')}
                        >
                            {dayjs(booking.time).format('MM/DD HH:mm')}
                        </Descriptions.Item>

                        <Descriptions.Item 
                            label={t('booking.bookingManagement.modal.fields.numberOfPeople')}
                        >
                            {booking.adult}
                        </Descriptions.Item>

                        <Descriptions.Item 
                            label={t('booking.bookingManagement.modal.fields.phoneNumber')}
                        >
                            {booking.phoneNumber}
                        </Descriptions.Item>

                        {booking.restaurantNotes && (
                            <Descriptions.Item 
                                label={t('booking.bookingManagement.modal.fields.message')}
                                span={2}
                            >
                                {booking.restaurantNotes}
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </Card>
            )}
        </Modal>
    );
};

export default BookingDetailsModal;