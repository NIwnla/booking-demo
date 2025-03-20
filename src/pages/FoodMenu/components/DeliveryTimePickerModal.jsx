import React from 'react';
import { Modal, DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const DeliveryTimePickerModal = ({ isOpen, onClose, value, onChange }) => {
    const { t } = useTranslation('global');

    return (
        <Modal
            title={t('foodMenu.deliveryTime.modalTitle')}
            open={isOpen}
            onCancel={onClose}
            onOk={onClose}
        >
            <DatePicker
                showTime={{
                    format: 'HH:mm',
                    minuteStep: 15,
                }}
                format="DD/MM/YYYY HH:mm"
                value={value ? dayjs(value) : null}
                onChange={onChange}
                style={{ width: '100%' }}
                disabledDate={(current) => {
                    return current && current < dayjs().startOf('day');
                }}
                disabledTime={(current) => {
                    const now = dayjs();
                    const minTime = now.add(30, 'minute');
                    
                    if (current && current.isSame(now, 'day')) {
                        return {
                            disabledHours: () => Array.from({ length: 24 }, (_, i) => i)
                                .filter(hour => hour < minTime.hour()),
                            disabledMinutes: (selectedHour) => {
                                if (selectedHour === minTime.hour()) {
                                    return Array.from({ length: 60 }, (_, i) => i)
                                        .filter(minute => minute < minTime.minute());
                                }
                                return [];
                            }
                        };
                    }
                    return {};
                }}
            />
        </Modal>
    );
};

export default DeliveryTimePickerModal;