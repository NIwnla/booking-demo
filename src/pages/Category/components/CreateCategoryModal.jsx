import React, { useEffect, useState } from "react";
import { App, Button, Form, Input, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../service/axios";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import CropImageModal from "../../../components/modals/image/CropImageModal";

const CreateCategoryModal = ({ visible, onClose, onCategoryCreated }) => {
    const { t } = useTranslation('global');
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [isFetching, setIsFetching] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [croppedImage, setCroppedImage] = useState(null);
    const [isCropModalVisible, setCropModalVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            setFileList([]);
            setCroppedImage(null);
        }
    }, [visible]);

    const handleImageUpload = (info) => {
        if (info.fileList.length === 0) {
            setImageSrc(null);
            setCroppedImage(null);
            setFileList([]);
            message.info(t("category.categoryCreationModal.messages.imageRemoved"));
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
            message.error(t("category.categoryCreationModal.messages.uploadError"));
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

    const handleCreate = async (values) => {
        const formData = new FormData();
        formData.append("nameVN", values.nameVN);
        formData.append("nameEN", values.nameEN);
        if (croppedImage) {
            formData.append("imageFile", croppedImage);
        } else {
            message.error(t("food.createFoodModal.messages.noImage"));
            return;
        }
        setIsFetching(true);
        try {
            await axiosInstance.post(apiEndPoints.CATEGORY.CREATE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            message.success(t("category.categoryCreationModal.messages.createSuccess"));
            onCategoryCreated();
            onClose();
        } catch (error) {
            message.error(t("category.categoryCreationModal.messages.createError"));
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <>
            <Modal
                title={t("category.categoryCreationModal.titles.modalTitle")}
                open={visible}
                onCancel={onClose}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleCreate}>
                    <Form.Item
                        label={t("category.categoryCreationModal.labels.nameVN")}
                        name="nameVN"
                        rules={[
                            { required: true, message: t("category.categoryCreationModal.messages.rules.nameRequired") },
                            { max: 50, message: t("category.categoryCreationModal.messages.rules.nameMaxLength") },
                        ]}
                    >
                        <Input placeholder={t("category.categoryCreationModal.placeholders.nameVN")} />
                    </Form.Item>
                    <Form.Item
                        label={t("category.categoryCreationModal.labels.nameEN")}
                        name="nameEN"
                        rules={[
                            { required: true, message: t("category.categoryCreationModal.messages.rules.nameRequired") },
                            { max: 50, message: t("category.categoryCreationModal.messages.rules.nameMaxLength") },
                        ]}
                    >
                        <Input placeholder={t("category.categoryCreationModal.placeholders.nameEN")} />
                    </Form.Item>
                    <Form.Item
                        label={t("food.createFoodModal.labels.image")}
                        name="imageFile"
                        valuePropName="file"
                        rules={[{ required: true, message: t("food.createFoodModal.messages.rules.imageRequired") }]}
                    >
                        <Upload
                            name="imageFile"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={handleImageUpload}
                            fileList={fileList}
                        >
                            <Button icon={<UploadOutlined />}>{t("food.createFoodModal.buttons.selectImage")}</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isFetching}>
                            {t("category.categoryCreationModal.buttons.create")}
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

export default CreateCategoryModal;