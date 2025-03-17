import React, { useState } from 'react';
import { Modal, Form, Input, Button, Upload, App } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axiosInstance from '../../../service/axios';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import { useTranslation } from 'react-i18next';
import BranchLocationFilterBox from './BranchLocationFilterBox';

const BranchCreationModal = ({ open, onClose, onBranchCreated }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();
    const { t } = useTranslation('global');

    const handleFinish = async (values) => {
        const formData = new FormData();
        formData.append('NameVN', values.nameVN);
        formData.append('NameEN', values.nameEN);
        formData.append('DescriptionVN', values.descriptionVN);
        formData.append('DescriptionEN', values.descriptionEN);
        formData.append('ImageFile', values.imageFile.file);
        formData.append('BranchLocationId', values.locationId);

        setLoading(true);

        try {
            const response = await axiosInstance.post(apiEndPoints.BRANCH.CREATE, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success(t('branch.creationModal.messages.success'));
            form.resetFields();
            onBranchCreated(response.data);
            onClose();
        } catch (error) {
            message.error(t('branch.creationModal.messages.error'));
            console.error('Error creating branch:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={t('branch.creationModal.titles.modalTitle')}
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item
                    label={t('branch.creationModal.form.nameVN.label')}
                    name="nameVN"
                    rules={[{ required: true, message: t('branch.creationModal.form.nameVN.required') }]}
                >
                    <Input placeholder={t('branch.creationModal.form.nameVN.placeholder')} />
                </Form.Item>

                <Form.Item
                    label={t('branch.creationModal.form.nameEN.label')}
                    name="nameEN"
                    rules={[{ required: true, message: t('branch.creationModal.form.nameEN.required') }]}
                >
                    <Input placeholder={t('branch.creationModal.form.nameEN.placeholder')} />
                </Form.Item>

                <Form.Item
                    label={t('branch.creationModal.form.descriptionVN.label')}
                    name="descriptionVN"
                    rules={[{ required: true, message: t('branch.creationModal.form.descriptionVN.required') }]}
                >
                    <Input.TextArea rows={4} placeholder={t('branch.creationModal.form.descriptionVN.placeholder')} />
                </Form.Item>

                <Form.Item
                    label={t('branch.creationModal.form.descriptionEN.label')}
                    name="descriptionEN"
                    rules={[{ required: true, message: t('branch.creationModal.form.descriptionEN.required') }]}
                >
                    <Input.TextArea rows={4} placeholder={t('branch.creationModal.form.descriptionEN.placeholder')} />
                </Form.Item>

                <Form.Item
                    label={t('branch.creationModal.form.location.label')}
                    name="locationId"
                    rules={[{ required: true, message: t('branch.creationModal.form.location.required') }]}
                >
                    <BranchLocationFilterBox onLocationChange={(value) => form.setFieldValue('locationId', value)} />
                </Form.Item>

                <Form.Item
                    label={t('branch.creationModal.form.image.label')}
                    name="imageFile"
                    valuePropName="file"
                    rules={[{ required: true, message: t('branch.creationModal.form.image.required') }]}
                >
                    <Upload
                        name="imageFile"
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false}
                    >
                        <Button icon={<UploadOutlined />}>{t('branch.creationModal.form.image.placeholder')}</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {t('branch.creationModal.buttons.submit')}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BranchCreationModal;
