import { CloseCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, InputNumber, Modal, Tag, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import axiosInstance from "../../../service/axios";
import CropImageModal from "../image/CropImageModal";
import CategoryPickerModal from "../category/CategoryPickerModal";

const EditFoodModal = ({ visible, onClose, food, onFoodUpdated }) => {
    const { t } = useTranslation('global');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();
    const [imageSrc, setImageSrc] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [croppedImage, setCroppedImage] = useState(null);
    const [isCropModalVisible, setCropModalVisible] = useState(false);
    const [isPickerModalVisible, setIsPickerModalVisible] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState({});
    const [categoryIds, setCategoryIds] = useState([]);

    useEffect(() => {
        if (food) {
            form.setFieldsValue({
                name: food.name,
                description: food.description,
                basePrice: food.basePrice,
            });
            if (food.categories) {
                const categories = {};
                food.categories.forEach(category => {
                    categories[category.id] = category.name;
                });
                setSelectedCategories(categories);
                setCategoryIds(Object.keys(categories));
            }
        }
    }, [food]);


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
        setLoading(true);
        const formData = new FormData();
        formData.append("Name", values.name);
        formData.append("BasePrice", values.basePrice);
        formData.append("Description", values.description);
        if (croppedImage) {
            formData.append("imageFile", croppedImage);
        }
        categoryIds.forEach((id) => formData.append("CategoryIds", id));
        try {
            await axiosInstance.put(apiEndPoints.FOOD.EDIT(food.id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            message.success(t("food.editFoodModal.messages.updateSuccess"));
            onFoodUpdated();
            onClose();
            form.resetFields();
            setFileList([]);
            setCroppedImage(null);
        } catch (error) {
            message.error(t("food.editFoodModal.messages.updateError"));
        } finally {
            setLoading(false);
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
        setCategoryIds(Object.keys(updatedCategories));
    };

    return (
        <>
            <Modal
                title={t("food.editFoodModal.titles.modalTitle")}
                open={visible}
                onCancel={onClose}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item
                        name="name"
                        label={t("food.editFoodModal.labels.name")}
                        rules={[
                            { required: true, message: t("food.editFoodModal.messages.rules.nameRequired") },
                            { max: 50, message: t("food.editFoodModal.messages.rules.nameMaxLength") },
                        ]}
                    >
                        <Input placeholder={t("food.editFoodModal.placeholders.name")} />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={t("food.editFoodModal.labels.description")}
                        rules={[
                            { max: 200, message: t("food.editFoodModal.messages.rules.descriptionMaxLength") },
                        ]}
                    >
                        <Input.TextArea placeholder={t("food.editFoodModal.placeholders.description")} />
                    </Form.Item>
                    <Form.Item
                        name="basePrice"
                        label={t("food.editFoodModal.labels.basePrice")}
                        rules={[
                            { required: true, message: t("food.editFoodModal.messages.rules.priceRequired") },
                        ]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} placeholder={t("food.editFoodModal.placeholders.basePrice")} />
                    </Form.Item>

                    <Form.Item>
                        <Button onClick={handlePickerOpen}>
                            {t("food.editFoodModal.buttons.selectCategories")}
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
                            {t("food.editFoodModal.buttons.updateFood")}
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

export default EditFoodModal;










