import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, InputNumber, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import axiosInstance from "../../../service/axios";
import CropImageModal from "../image/CropImageModal";
import { AxiosConstants } from "../../../constaints/axiosContaint";

const EditFoodModal = ({ visible, onClose, food, onFoodUpdated }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();
    const [imageSrc, setImageSrc] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [croppedImage, setCroppedImage] = useState(null);
    const [isCropModalVisible, setCropModalVisible] = useState(false);

    useEffect(() => {
        if (food) {
            form.setFieldsValue({
                name: food.name,
                description: food.description,
                basePrice: food.basePrice,
            });
        }
    }, [food, loading])

    const handleImageUpload = (info) => {
        if (info.fileList.length === 0) {
            setImageSrc(null);
            setCroppedImage(null);
            setFileList([]);
            message.info("Hình ảnh đã được xóa.");
            return;
        }

        const file = info.file.originFileObj || info.file;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setCropModalVisible(true);
            };
            reader.readAsDataURL(file);
        } else {
            message.error("Tải tệp lên thất bại. Vui lòng thử lại.");
        }
    };

    const handleCropComplete = (croppedImg) => {
        const file = new File([croppedImg], "cropped-image.jpg", { type: "image/jpeg" });
        setCroppedImage(file);
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;

            setFileList([
                {
                    uid: "-1",
                    name: "cropped-image.jpg",
                    status: "done",
                    url: base64,
                },
            ]);
        };
        reader.readAsDataURL(file);
    };

    const handleFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("Name", values.name);
        formData.append("BasePrice", values.basePrice);
        formData.append("Description", values.description);
        if (croppedImage) {
            formData.append("imageFile", croppedImage);
        }
        try {
            await axiosInstance.put(apiEndPoints.FOOD.EDIT(food.id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            message.success("Cập nhật món ăn thành công!");
            onFoodUpdated();
            onClose();
            form.resetFields();
            setFileList([]);
            setCroppedImage(null);
        } catch (error) {
            message.error("Cập nhật món ăn thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                title="Chỉnh sửa món ăn"
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
                        label="Tên món ăn"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên món ăn" },
                            { max: 50, message: "Tên món ăn không được vượt quá 50 ký tự" },
                        ]}
                    >
                        <Input placeholder="Nhập tên món ăn" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[
                            { max: 200, message: "Mô tả không được vượt quá 200 ký tự" },
                        ]}
                    >
                        <Input.TextArea placeholder="Nhập mô tả" />
                    </Form.Item>
                    <Form.Item
                        name="basePrice"
                        label="Giá cơ bản"
                        rules={[{ required: true, message: "Vui lòng nhập giá cơ bản" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập giá cơ bản" />
                    </Form.Item>

                    <Form.Item name="imageFile" label="Hình ảnh món ăn" valuePropName="file">
                        <Upload
                            name="image"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={handleImageUpload}
                            fileList={fileList}
                        >
                            <Button icon={<UploadOutlined />}>Tải hình ảnh mới (không bắt buộc)</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Cập nhật món ăn
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {imageSrc && (
                <CropImageModal
                    visible={isCropModalVisible}
                    imageSrc={imageSrc}
                    onClose={() => setCropModalVisible(false)}
                    onCropComplete={handleCropComplete}
                />
            )}
        </>
    );
};

export default EditFoodModal;
