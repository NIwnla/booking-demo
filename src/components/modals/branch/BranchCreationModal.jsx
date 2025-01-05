import React, { useState } from 'react';
import { Modal, Form, Input, Button, Upload, App } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axiosInstance from '../../../service/axios';
import { apiEndPoints } from '../../../constaints/apiEndPoint';

const BranchCreationModal = ({ open, onClose, onBranchCreated }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    const handleFinish = async (values) => {
        const formData = new FormData();
        formData.append('Name', values.name);
        formData.append('Description', values.description);
        formData.append('ImageFile', values.imageFile.file);

        setLoading(true);

        try {
            const response = await axiosInstance.post(apiEndPoints.BRANCH.CREATE, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success('Branch created successfully!');
            form.resetFields();
            onBranchCreated(response.data); // Notify parent component
            onClose();
        } catch (error) {
            message.error('Failed to create branch. Please try again.');
            console.error('Error creating branch:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Create New Branch"
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
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter the branch name' }]}
                >
                    <Input placeholder="Enter branch name" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter the branch description' }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter branch description" />
                </Form.Item>

                <Form.Item
                    label="Image"
                    name="imageFile"
                    valuePropName="file"
                    rules={[{ required: true, message: 'Please upload an image' }]}
                >
                    <Upload
                        name="imageFile"
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false} // Prevent automatic upload
                    >
                        <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create Branch
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BranchCreationModal;
