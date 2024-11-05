import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload, message, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import { showMessage } from "../../../helpers/showMessage";
import axiosInstance from "../../../service/axios";

const EditFoodModal = ({ visible, onClose, food, onFoodUpdated }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Food:", food)
    }, [form, loading])

    const handleFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("Name", values.name);
        formData.append("BasePrice", values.basePrice);
        if (values.imageFile) {
            formData.append("ImageFile", values.imageFile.file);
        }

        try {
            await axiosInstance.put(apiEndPoints.FOOD.EDIT(food.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            showMessage("success", "Food updated successfully!");
            onFoodUpdated();
            onClose();
        } catch (error) {
            showMessage("error", "Failed to update food.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Edit Food"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    name: food?.name,
                    basePrice: food?.basePrice,
                }}
            >
                <Form.Item
                    name="name"
                    label="Food Name"
                    rules={[{ required: true, message: "Please enter the food name" }]}
                >
                    <Input placeholder="Enter food name" />
                </Form.Item>

                <Form.Item
                    name="basePrice"
                    label="Base Price"
                    rules={[{ required: true, message: "Please enter the base price" }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter base price" />
                </Form.Item>

                <Form.Item
                    name="imageFile"
                    label="Food Image"
                    valuePropName="file"
                >
                    <Upload
                        name="image"
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false} // Prevent automatic upload
                    >
                        <Button icon={<UploadOutlined />}>Upload New Image (optional)</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update Food
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditFoodModal;
