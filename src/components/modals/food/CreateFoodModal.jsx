import React, { useEffect, useState } from "react";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Modal, Upload, Tag } from "antd";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../service/axios";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import CropImageModal from "../image/CropImageModal";
import CategoryPickerModal from "../category/CategoryPickerModal";

const CreateFoodModal = ({ visible, onClose, onFoodCreated }) => {
    const { t } = useTranslation("global");
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [imageSrc, setImageSrc] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [croppedImage, setCroppedImage] = useState(null);
    const [isCropModalVisible, setCropModalVisible] = useState(false);
    const [isPickerModalVisible, setIsPickerModalVisible] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [categoryIds, setCategoryIds] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleImageUpload = (info) => {
        if (info.fileList.length === 0) {
            setImageSrc(null);
            setCroppedImage(null);
            setFileList([]);
            message.info(t("food.createFoodModal.messages.imageRemoved"));
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
            message.error(t("food.createFoodModal.messages.uploadError"));
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
        formData.append("name", values.name);
        formData.append("basePrice", values.basePrice);
        formData.append("description", values.description);
        if (croppedImage) {
            formData.append("imageFile", croppedImage);
        } else {
            message.error(t("food.createFoodModal.messages.noImage"));
            return;
        }
        categoryIds.forEach((id) => formData.append("CategoryIds", id));

        setIsFetching(true);
        try {
            await axiosInstance.post(apiEndPoints.FOOD.CREATE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            message.success(t("food.createFoodModal.messages.createSuccess"));
            onFoodCreated();
            onClose();
            form.resetFields();
            setFileList([]);
            setCroppedImage(null);
            setCategoryIds([]);
            setSelectedCategories([]);
        } catch (error) {
            message.error(t("food.createFoodModal.messages.createError"));
        } finally {
            setIsFetching(false);
        }
    };

    const handlePickerOpen = () => {
        setIsPickerModalVisible(true);
    };

    const handlePickerClose = () => {
        setIsPickerModalVisible(false);
    };

    const handleCategorySelect = (categories) => {
        setSelectedCategories(categories);
        setCategoryIds(Object.keys(categories)); 
    };

    const removeCategory = (id) => {
        const updatedCategories = { ...selectedCategories };
        delete updatedCategories[id];
        setSelectedCategories(updatedCategories);
        setCategoryIds(Object.keys(updatedCategories)); // Update ids when category is removed
    };

    return (
        <>
            <Modal
                title={t("food.createFoodModal.titles.modalTitle")}
                open={visible}
                onCancel={onClose}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleCreate}>
                    <Form.Item
                        label={t("food.createFoodModal.labels.name")}
                        name="name"
                        rules={[
                            { required: true, message: t("food.createFoodModal.messages.rules.nameRequired") },
                            { max: 50, message: t("food.createFoodModal.messages.rules.nameMaxLength") },
                        ]}
                    >
                        <Input placeholder={t("food.createFoodModal.placeholders.name")} />
                    </Form.Item>
                    <Form.Item
                        label={t("food.createFoodModal.labels.basePrice")}
                        name="basePrice"
                        rules={[
                            { required: true, message: t("food.createFoodModal.messages.rules.priceRequired") },
                        ]}
                    >
                        <Input placeholder={t("food.createFoodModal.placeholders.basePrice")} type="number" />
                    </Form.Item>
                    <Form.Item
                        label={t("food.createFoodModal.labels.description")}
                        name="description"
                        rules={[
                            { required: true, message: t("food.createFoodModal.messages.rules.descriptionRequired") },
                            { max: 500, message: t("food.createFoodModal.messages.rules.descriptionMaxLength") },
                        ]}
                    >
                        <Input.TextArea placeholder={t("food.createFoodModal.placeholders.description")} rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={handlePickerOpen}>
                            {t("food.createFoodModal.buttons.selectCategories")}
                        </Button>
                    </Form.Item>
                    <div style={{ marginBottom: "16px" }}>
                        {Object.keys(selectedCategories).map((id) => (
                            <Tag
                                key={id}
                                closable
                                onClose={() => removeCategory(id)}
                                closeIcon={<CloseCircleOutlined />}
                            >
                                {selectedCategories[id]}
                            </Tag>
                        ))}
                    </div>
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
                            {t("food.createFoodModal.buttons.create")}
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
            <CategoryPickerModal
                isOpen={isPickerModalVisible}
                onClose={handlePickerClose}
                onSelect={handleCategorySelect}
                selectedList={selectedCategories}
            />
        </>
    );
};

export default CreateFoodModal;
