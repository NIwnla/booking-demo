import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import axiosInstance from "../../../service/axios";
import { useTranslation } from "react-i18next";
import CropImageModal from "../image/CropImageModal";

const CreateFoodOptionModal = ({ visible, onClose, onOptionCreated, foodId }) => {
    const { t } = useTranslation('global');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();
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

    const handleFinish = async (values) => {
        const formData = new FormData();
        formData.append("NameVN", values.nameVN);
        formData.append("NameEN", values.nameEN);
        formData.append("Price", values.price);
        formData.append("FoodId", foodId);

        if (croppedImage) {
            formData.append("imageFile", croppedImage);
        } else {
            message.error(t("food.createFoodModal.messages.noImage"));
            return;
        }

        setLoading(true);

        try {
            await axiosInstance.post(apiEndPoints.FOOD_OPTION.CREATE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            message.success(t('foodOption.createModal.messages.createSuccess'));
            form.resetFields();
            onOptionCreated();
            onClose();
        } catch (error) {
            message.error(t('foodOption.createModal.messages.createError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                title={t('foodOption.createModal.titles.modalTitle')}
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
                        name="nameVN"
                        label={t('foodOption.createModal.labels.nameVN')}
                        rules={[
                            { required: true, message: t('foodOption.createModal.messages.rules.nameVNRequired') },
                            { max: 50, message: t('foodOption.createModal.messages.rules.nameVNMaxLength') },
                        ]}
                    >
                        <Input placeholder={t('foodOption.createModal.placeholders.nameVN')} />
                    </Form.Item>

                    <Form.Item
                        name="nameEN"
                        label={t('foodOption.createModal.labels.nameEN')}
                        rules={[
                            { required: true, message: t('foodOption.createModal.messages.rules.nameENRequired') },
                            { max: 50, message: t('foodOption.createModal.messages.rules.nameENMaxLength') },
                        ]}
                    >
                        <Input placeholder={t('foodOption.createModal.placeholders.nameEN')} />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label={t('foodOption.createModal.labels.price')}
                        rules={[{ required: true, message: t('foodOption.createModal.messages.rules.priceRequired') }]}
                    >
                        <Input placeholder={t('foodOption.createModal.placeholders.price')} type="number" />
                    </Form.Item>

                    <Form.Item
                        name="imageFile"
                        label={t('foodOption.createModal.labels.imageFile')}
                        valuePropName="file"
                        rules={[{ required: true, message: t('foodOption.createModal.messages.rules.imageFileRequired') }]}
                    >
                        <Upload
                            name="imageFile"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={handleImageUpload}
                            fileList={fileList}
                        >
                            <Button icon={<UploadOutlined />}>{t('foodOption.createModal.buttons.uploadImage')}</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {t('foodOption.createModal.buttons.createOption')}
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

export default CreateFoodOptionModal;
