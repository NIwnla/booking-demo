import React from 'react';
import { Modal, Image, Typography, Button } from 'antd';
import axiosInstance from '../../../service/axios';
import { useTranslation } from 'react-i18next';

const FoodDeliveryDetailModal = ({
    visible,
    food,
    onClose,
    onIncrement
}) => {
    const { t } = useTranslation('global');

    return (
        <Modal
            open={visible}
            title={food?.name}
            onCancel={onClose}
            footer={null}
        >
            {food && (
                <>
                    <Image
                        alt={food.name}
                        src={`${axiosInstance.defaults.baseURL}/${food.imagePath}`}
                    />
                    <Typography.Paragraph style={{ marginTop: '16px' }}>
                        <strong>{t('delivery.detailModal.labels.description')}: </strong>
                        {food.description || t('delivery.detailModal.messages.noDescription')}
                    </Typography.Paragraph>
                    <Typography.Paragraph style={{ marginTop: '16px' }}>
                        <strong>{t('delivery.detailModal.labels.price')}: </strong>
                        {food.basePrice}VND
                    </Typography.Paragraph>
                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => {
                                onIncrement(food); // Increment the quantity for the selected food
                                onClose(); // Close the modal after incrementing
                            }}
                            style={{ borderRadius: '8px' }}
                        >
                            {t('delivery.detailModal.buttons.orderFood')}
                        </Button>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default FoodDeliveryDetailModal;
