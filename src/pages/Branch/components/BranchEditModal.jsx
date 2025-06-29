import { UploadOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, Modal, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import { AxiosConstants } from '../../../constaints/axiosContaint';
import axiosInstance from '../../../service/axios';
import { useTranslation } from 'react-i18next';
import BranchLocationFilterBox from './BranchLocationFilterBox';

const BranchEditModal = ({ open, onClose, branch, onBranchUpdated }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const { message } = App.useApp();
    const { t } = useTranslation('global');

    useEffect(() => {
        if (branch) {
            form.setFieldsValue({
                nameVN: branch.nameVN,
                nameEN: branch.nameEN,
                descriptionVN: branch.descriptionVN,
                descriptionEN: branch.descriptionEN,
                locationId: branch.branchLocationId,
                numberOfTables: branch.numberOfTables
            });

            setFileList(branch.imagePath ? [
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: `${AxiosConstants.AXIOS_BASEURL}/${branch.imagePath}`,
                },
            ] : []);
        }
    }, [branch, form]);

    const handleFinish = async (values) => {
        const formData = new FormData();
        formData.append('NameVN', values.nameVN);
        formData.append('NameEN', values.nameEN);
        formData.append('DescriptionVN', values.descriptionVN);
        formData.append('DescriptionEN', values.descriptionEN);
        formData.append('BranchLocationId', values.locationId);
        formData.append('NumberOfTables', values.numberOfTables);

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('ImageFile', fileList[0].originFileObj);
        }

        setLoading(true);

        try {
            const response = await axiosInstance.put(apiEndPoints.BRANCH.EDIT(branch.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success(t('branch.editModal.messages.success'));
            form.resetFields();
            setFileList([]);
            onBranchUpdated(response.data);
            onClose();
        } catch (error) {
            message.error(t('branch.editModal.messages.error'));
            console.error('Error updating branch:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    return (
        <Modal
            title={t('branch.editModal.titles.modalTitle')}
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
                    label={t('branch.editModal.form.nameVN.label')}
                    name="nameVN"
                    rules={[{ required: true, message: t('branch.editModal.form.nameVN.required') }]}
                >
                    <Input placeholder={t('branch.editModal.form.nameVN.placeholder')} />
                </Form.Item>

                <Form.Item
                    label={t('branch.editModal.form.nameEN.label')}
                    name="nameEN"
                    rules={[{ required: true, message: t('branch.editModal.form.nameEN.required') }]}
                >
                    <Input placeholder={t('branch.editModal.form.nameEN.placeholder')} />
                </Form.Item>

                <Form.Item
                    label={t('branch.editModal.form.descriptionVN.label')}
                    name="descriptionVN"
                    rules={[{ required: true, message: t('branch.editModal.form.descriptionVN.required') }]}
                >
                    <Input.TextArea rows={4} placeholder={t('branch.editModal.form.descriptionVN.placeholder')} />
                </Form.Item>

                <Form.Item
                    label={t('branch.editModal.form.descriptionEN.label')}
                    name="descriptionEN"
                    rules={[{ required: true, message: t('branch.editModal.form.descriptionEN.required') }]}
                >
                    <Input.TextArea rows={4} placeholder={t('branch.editModal.form.descriptionEN.placeholder')} />
                </Form.Item>

                <Form.Item
                    label={t('branch.editModal.form.location.label')}
                    name="locationId"
                    rules={[{ required: true, message: t('branch.editModal.form.location.required') }]}
                >
                    <BranchLocationFilterBox 
                        onLocationChange={(value) => form.setFieldValue('locationId', value)}
                        defaultValue={branch?.branchLocationId}
                    />
                </Form.Item>

                <Form.Item
                    label={t('branch.creationModal.form.numberOfTables.label')}
                    name="numberOfTables"
                    rules={[
                        { required: true, message: t('branch.creationModal.form.numberOfTables.required') },
                        { type: 'number', min: 1, message: t('branch.creationModal.form.numberOfTables.positive') }
                    ]}
                >
                    <Input type="number" min={1} placeholder={t('branch.creationModal.form.numberOfTables.placeholder')} />
                </Form.Item>

                <Form.Item
                    label={t('branch.editModal.form.image.label')}
                    name="imageFile"
                    rules={[{ required: false }]}
                >
                    <Upload
                        name="imageFile"
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false}
                        fileList={fileList}
                        onChange={handleFileChange}
                    >
                        <Button icon={<UploadOutlined />}>{t('branch.editModal.form.image.placeholder')}</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {t('branch.editModal.buttons.submit')}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BranchEditModal;
