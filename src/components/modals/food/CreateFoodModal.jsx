import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Modal, Upload } from "antd";
import React, { useState } from "react";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import axiosInstance from "../../../service/axios";
import CropImageModal from "../image/CropImageModal";

const CreateFoodModal = ({ visible, onClose, onFoodCreated }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [imageSrc, setImageSrc] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [croppedImage, setCroppedImage] = useState(null);
    const [isCropModalVisible, setCropModalVisible] = useState(false);

    const handleImageUpload = (info) => {
        if (info.fileList.length === 0) {
            // Handle image removal
            setImageSrc(null);
            setCroppedImage(null);
            setFileList([]);
            message.info("Image removed.");
            return;
        }

        const file = info.file.originFileObj || info.file; // Fallback to `info.file`
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result); // Set the base64 string for cropping
                setCropModalVisible(true); // Open the crop modal
            };
            reader.readAsDataURL(file);
        } else {
            message.error("File upload failed. Please try again.");
        }
    };

    // Handle when cropping is complete
    const handleCropComplete = (croppedImg) => {
        const file = new File([croppedImg], "cropped-image.jpg", { type: "image/jpeg" });
        setCroppedImage(file);
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;

            // Update the Upload component fileList for preview
            setFileList([
                {
                    uid: "-1",
                    name: "cropped-image.jpg",
                    status: "done",
                    url: base64, // Base64 preview for the cropped image
                },
            ]);
        };
        reader.readAsDataURL(file);
    };


    const handleCreate = async (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("basePrice", values.basePrice);
        formData.append("description", values.description);
        if (croppedImage) {
            formData.append("imageFile", croppedImage);
        } else {
            message.error("Please upload and crop an image before submitting.");
            return;
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
            setFileList([]);
            setCroppedImage(null);
        } catch (error) {
            message.error("Failed to create food.");
        }
    };

    return (
        <>
            <Modal
                title="Tạo Món Ăn Mới"
                open={visible}
                onCancel={onClose}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleCreate}>
                    <Form.Item
                        label="Tên Món Ăn"
                        name="name"
                        rules={
                            [
                                { required: true, message: "Vui lòng nhập tên món ăn" },
                                { max: 50, message: "Tên món ăn không được vượt quá 50 ký tự" },
                            ]
                        }
                    >
                        <Input placeholder="Nhập tên món ăn" />
                    </Form.Item>
                    <Form.Item
                        label="Giá Cơ Bản"
                        name="basePrice"
                        rules={[{ required: true, message: "Vui lòng nhập giá cơ bản" }]}
                    >
                        <Input placeholder="Nhập giá cơ bản" type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Mô Tả"
                        name="description"
                        rules={[
                            { required: true, message: "Vui lòng nhập mô tả" },
                            { max: 500, message: "Mô tả không được vượt quá 500 ký tự" },
                        ]}
                    >
                        <Input.TextArea placeholder="Nhập mô tả" rows={4} />
                    </Form.Item>
                    <Form.Item
                        label="Hình Ảnh"
                        name="imageFile"
                        valuePropName="file"
                        rules={[{ required: true, message: "Vui lòng tải lên hình ảnh" }]}
                    >
                        <Upload
                            name="imageFile"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={handleImageUpload}
                            fileList={fileList} // Controlled file list
                        >
                            <Button icon={<UploadOutlined />}>Chọn Hình Ảnh</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Tạo Món Ăn
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {
                imageSrc && (
                    <CropImageModal
                        visible={isCropModalVisible}
                        imageSrc={imageSrc}
                        onClose={() => setCropModalVisible(false)}
                        onCropComplete={handleCropComplete}
                    />
                )
            }
        </>
    );
};

export default CreateFoodModal;
