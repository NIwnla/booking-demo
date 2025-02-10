import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import axiosInstance from "../../../service/axios";
import CropImageModal from "../image/CropImageModal";

const EditCategoryModal = ({ open, onClose, category, onCategoryUpdated }) => {
    const { t } = useTranslation('global');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();
    const [imageSrc, setImageSrc] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [croppedImage, setCroppedImage] = useState(null);
    const [isCropModalVisible, setCropModalVisible] = useState(false);

    useEffect(() => {
        if (category) {
            form.resetFields();
            setFileList([]);
            setCroppedImage(null);
            form.setFieldsValue({
                nameVN: category.nameVN,
                nameEN: category.nameEN
            });
        }
    }, [category]);

    const handleImageUpload = (info) => {
        if (info.fileList.length === 0) {
            setImageSrc(null);
            setCroppedImage(null);
            setFileList([]);
            message.info(t("food.editFoodModal.messages.imageRemoved"));
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
            message.error(t("food.editFoodModal.messages.uploadError"));
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
        const formData = new FormData();
        formData.append("nameVN", values.nameVN);
        formData.append("nameEN", values.nameEN);
        if (croppedImage) {
            formData.append("imageFile", croppedImage);
        }
        setLoading(true);
        try {
            await axiosInstance.put(apiEndPoints.CATEGORY.EDIT(category.id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            message.success(t("category.categoryEditModal.messages.updateSuccess"));
            onCategoryUpdated();
            onClose();
        } catch (error) {
            message.error(t("category.categoryEditModal.messages.updateError"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                title={t("category.categoryEditModal.titles.modalTitle")}
                open={open}
                onCancel={onClose}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item
                        name="nameVN"
                        label={t("category.categoryEditModal.labels.nameVN")}
                        rules={[
                            { required: true, message: t("category.categoryEditModal.messages.rules.nameVNRequired") },
                            { max: 50, message: t("category.categoryEditModal.messages.rules.nameVNMaxLength") },
                        ]}
                    >
                        <Input placeholder={t("category.categoryEditModal.placeholders.nameVN")} />
                    </Form.Item>
                    <Form.Item
                        name="nameEN"
                        label={t("category.categoryEditModal.labels.nameEN")}
                        rules={[
                            { required: true, message: t("category.categoryEditModal.messages.rules.nameENRequired") },
                            { max: 50, message: t("category.categoryEditModal.messages.rules.nameENMaxLength") },
                        ]}
                    >
                        <Input placeholder={t("category.categoryEditModal.placeholders.nameEN")} />
                    </Form.Item>

                    <Form.Item name="imageFile" label={t("food.editFoodModal.labels.image")} valuePropName="file">
                        <Upload
                            name="image"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={handleImageUpload}
                            fileList={fileList}
                        >
                            <Button icon={<UploadOutlined />}>{t("food.editFoodModal.buttons.uploadImage")}</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {t("category.categoryEditModal.buttons.updateCategory")}
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

export default EditCategoryModal;