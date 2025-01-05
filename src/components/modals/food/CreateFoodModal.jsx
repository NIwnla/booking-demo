import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Modal, Upload } from "antd";
import React from "react";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import axiosInstance from "../../../service/axios";

const CreateFoodModal = ({ visible, onClose, onFoodCreated }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const handleCreate = async (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("basePrice", values.basePrice);
        if (values.imageFile) {
            formData.append("imageFile", values.imageFile.file);
        }

        try {
            await axiosInstance.post(apiEndPoints.FOOD.CREATE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            message.success("Food created successfully!");
            onFoodCreated();
            onClose();
            form.resetFields();
        } catch (error) {
            message.error("Failed to create food.");
        }
    };

    return (
        <Modal
            title="Create New Food"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form layout="vertical" form={form} onFinish={handleCreate}>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={
                        [
                            { required: true, message: "Please enter the food name" },
                            { max: 50, message: "Food name cannot exceed 50 characters" },
                        ]
                    }
                >
                    <Input placeholder="Enter food name" />
                </Form.Item>
                <Form.Item
                    label="Base Price"
                    name="basePrice"
                    rules={[{ required: true, message: "Please enter the base price" }]}
                >
                    <Input placeholder="Enter base price" type="number" />
                </Form.Item>
                <Form.Item
                    label="Image"
                    name="imageFile"
                    valuePropName="file"
                    rules={[{ required: true, message: "Please upload an image" }]}
                >
                    <Upload
                        name="imageFile"
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false}
                    >
                        <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create Food
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateFoodModal;
