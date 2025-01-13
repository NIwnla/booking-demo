import React from 'react';
import { Modal, Image, Typography, Button } from 'antd';
import axiosInstance from '../../../service/axios';

const FoodDeliveryDetailModal = ({
    visible,
    food,
    onClose,
    onIncrement
}) => {
    return (
        <Modal
            open={visible}
            title={food?.name}
            onCancel={onClose}
            footer={null} // Remove the default footer
        >
            <Image
                alt={food?.name}
                src={`${axiosInstance.defaults.baseURL}/${food?.imagePath}`}
            />
            <Typography.Paragraph style={{ marginTop: '16px' }}>
                <strong>Mô tả: </strong>{food?.description}
            </Typography.Paragraph>
            <Typography.Paragraph style={{ marginTop: '16px' }}>
                <strong>Giá: </strong>{food?.basePrice}đ
            </Typography.Paragraph>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Button
                    type="primary"
                    size="large"
                    onClick={() => {
                        onIncrement(food || null); // Increment the quantity for the selected food
                        onClose(); // Close the modal after incrementing
                    }}
                    style={{ borderRadius: '8px' }}
                >
                    Đặt món
                </Button>
            </div>
        </Modal>
    );
};

export default FoodDeliveryDetailModal;