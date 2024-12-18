import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../../../service/axios";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import { showMessage } from "../../../helpers/showMessage";

const CreateFoodOptionModal = ({ visible, onClose, onOptionCreated, foodId }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleFinish = async (values) => {
        const formData = new FormData();
        formData.append("Name", values.name);
        formData.append("Price", values.price);
        formData.append("ImageFile", values.imageFile.file);
        formData.append("FoodId", foodId);

        setLoading(true);

        try {
            await axiosInstance.post(apiEndPoints.FOOD_OPTION.CREATE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            showMessage("success", "Option created successfully!")
            form.resetFields();
            onOptionCreated();
            onClose();
        } catch (error) {
            showMessage("error","Failed to create option.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Create Food Option"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item
                    name="name"
                    label="Option Name"
                    rules={
                        [
                            { required: true, message: "Please enter the option name" },
                            { max: 50, message: "Option name cannot exceed 50 characters" },
                        ]
                    }
                >
                    <Input placeholder="Enter option name" />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Additional Price"
                    rules={[{ required: true, message: "Please enter the additional price" }]}
                >
                    <Input placeholder="Enter additional price" type="number" />
                </Form.Item>

                <Form.Item
                    name="imageFile"
                    label="Image"
                    valuePropName="file"
                    rules={[{ required: true, message: "Please upload an image for the option" }]}
                >
                    <Upload
                        name="imageFile"
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false} // Prevent automatic upload
                    >
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create Option
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateFoodOptionModal;

