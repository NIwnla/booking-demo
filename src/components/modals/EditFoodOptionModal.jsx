import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../../service/axios";
import { apiEndPoints } from "../../constaints/apiEndPoint";
import { showMessage } from './../../helpers/showMessage';

const EditFoodOptionModal = ({ visible, onClose, option, onOptionUpdated, foodId }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("Name", values.name);
        formData.append("Price", values.price);
        formData.append("FoodId", foodId);
        if (values.imageFile) {
            formData.append("ImageFile", values.imageFile.file);
        }
        try {
            await axiosInstance.put(apiEndPoints.FOOD_OPTION.EDIT(option.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            showMessage("success","Option updated successfully!");
            onOptionUpdated();
            onClose();
        } catch (error) {
            showMessage("error","Failed to update option.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Edit Food Option"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    name: option.name,
                    price: option.price,
                }}
            >
                <Form.Item
                    name="name"
                    label="Option Name"
                    rules={[{ required: true, message: "Please enter the option name" }]}
                >
                    <Input placeholder="Enter option name" />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Additional Price"
                    rules={[{ required: true, message: "Please enter the additional price" }]}
                >
                    <Input placeholder="Enter additional price" />
                </Form.Item>

                <Form.Item
                    name="imageFile"
                    label="Option Image"
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
                        Update Option
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditFoodOptionModal;
