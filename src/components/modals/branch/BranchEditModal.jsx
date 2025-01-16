import { UploadOutlined } from '@ant-design/icons';
import { App, Button, Form, Input, Modal, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import { AxiosConstants } from '../../../constaints/axiosContaint';
import axiosInstance from '../../../service/axios';
import { useTranslation } from 'react-i18next';

const BranchEditModal = ({ open, onClose, branch, onBranchUpdated }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const { message } = App.useApp();
    const { t } = useTranslation('global');

    useEffect(() => {
        if (branch) {
            form.setFieldsValue({
                name: branch.name,
                description: branch.description,
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
        formData.append('Name', values.name);
        formData.append('Description', values.description);

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
                    label={t('branch.editModal.form.name.label')}
                    name="name"
                    rules={[{ required: true, message: t('branch.editModal.form.name.required') }]}
                >
                    <Input placeholder={t('branch.editModal.form.name.placeholder')} />
                </Form.Item>

                <Form.Item
                    label={t('branch.editModal.form.description.label')}
                    name="description"
                    rules={[{ required: true, message: t('branch.editModal.form.description.required') }]}
                >
                    <Input.TextArea rows={4} placeholder={t('branch.editModal.form.description.placeholder')} />
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
