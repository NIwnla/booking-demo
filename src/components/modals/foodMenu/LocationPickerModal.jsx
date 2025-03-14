import React, { useContext } from 'react';
import { Modal, Button, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import LocationPicker from '../../maps/LocationPicker';
import { DeliveryContext } from '../../../context/DeliveryContext';

const LocationPickerModal = ({ 
    isOpen, 
    onClose
}) => {
    const { t } = useTranslation('global');
    const { location, setLocation } = useContext(DeliveryContext);

    const handleCancel = () => {
        onClose();
        setLocation(null);
    };

    const handleConfirm = () => {
        onClose();
    };

    const handleLocationSelect = (newLocation) => {
        setLocation(newLocation);
    };

    return (
        <Modal
            title={t("foodMenu.mainPage.selectLocation")}
            open={isOpen}
            onCancel={handleCancel}
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button onClick={handleCancel}>
                        {t("foodMenu.mainPage.mapModal.cancel")}
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleConfirm}
                        disabled={!location}
                    >
                        {t("foodMenu.mainPage.mapModal.confirm")}
                    </Button>
                </div>
            }
            width={800}
        >
            <LocationPicker onLocationSelect={handleLocationSelect} />
            {location && (
                <div style={{ marginTop: '16px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <Typography.Title level={5}>{t("foodMenu.mainPage.mapModal.selectedLocation")}</Typography.Title>
                    <Typography.Text>{location.formattedAddress}</Typography.Text>
                </div>
            )}
        </Modal>
    );
};

export default LocationPickerModal;