import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axiosInstance from '../../../service/axios';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import { AxiosConstants } from '../../../constaints/axiosContaint';

const BranchEditModal = ({ open, onClose, branch, onBranchUpdated }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (branch) {
            form.setFieldsValue({
                name: branch.name,
                description: branch.description,
            });

            setFileList(branch.imagePath ? [{
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: `${AxiosConstants.AXIOS_BASEURL}/${branch.imagePath}`,
            }] : []);
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

            message.success('Branch updated successfully!');
            form.resetFields();
            setFileList([]); // Clear the file list after submission
            onBranchUpdated(response.data); // Notify parent component
            onClose();
        } catch (error) {
            message.error('Failed to update branch. Please try again.');
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
            title="Edit Branch"
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
                    rules={[{ required: false }]}
                >
                    <Upload
                        name="imageFile"
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false} // Prevent automatic upload
                        fileList={fileList}
                        onChange={handleFileChange}
                    >
                        <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update Branch
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BranchEditModal;
