import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import axiosInstance from "../../../service/axios";
import { useTranslation } from "react-i18next";
import CropImageModal from "../image/CropImageModal";

const EditFoodOptionModal = ({ visible, onClose, option, onOptionUpdated, foodId }) => {
    const { t } = useTranslation('global');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();
    const [imageSrc, setImageSrc] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [croppedImage, setCroppedImage] = useState(null);
    const [isCropModalVisible, setCropModalVisible] = useState(false);

    useEffect(() => {
        form.resetFields();
        setFileList([]);
        setCroppedImage(null);
        if (option) {
            form.setFieldsValue({
                nameVN: option.nameVN,
                nameEN: option.nameEN,
                price: option.price,
            });
        }
    }, [option]);

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
        formData.append("NameVN", values.nameVN);
        formData.append("NameEN", values.nameEN);
        formData.append("Price", values.price);
        formData.append("FoodId", foodId);
        if (croppedImage) {
            formData.append("imageFile", croppedImage);
        }
        try {
            await axiosInstance.put(apiEndPoints.FOOD_OPTION.EDIT(option.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success(t('foodOption.editModal.messages.updateSuccess'));
            onOptionUpdated();
            onClose();
        } catch (error) {
            message.error(t('foodOption.editModal.messages.updateError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal
                title={t('foodOption.editModal.titles.modalTitle')}
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
                        label={t('foodOption.editModal.labels.nameVN')}
                        rules={[
                            { required: true, message: t('foodOption.editModal.messages.rules.nameVNRequired') },
                            { max: 50, message: t('foodOption.editModal.messages.rules.nameVNMaxLength') },
                        ]}
                    >
                        <Input placeholder={t('foodOption.editModal.placeholders.nameVN')} />
                    </Form.Item>

                    <Form.Item
                        name="nameEN"
                        label={t('foodOption.editModal.labels.nameEN')}
                        rules={[
                            { required: true, message: t('foodOption.editModal.messages.rules.nameENRequired') },
                            { max: 50, message: t('foodOption.editModal.messages.rules.nameENMaxLength') },
                        ]}
                    >
                        <Input placeholder={t('foodOption.editModal.placeholders.nameEN')} />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label={t('foodOption.editModal.labels.price')}
                        rules={[{ required: true, message: t('foodOption.editModal.messages.rules.priceRequired') }]}
                    >
                        <Input placeholder={t('foodOption.editModal.placeholders.price')} />
                    </Form.Item>

                    <Form.Item
                        name="imageFile"
                        label={t('foodOption.editModal.labels.imageFile')}
                        valuePropName="file"
                    >
                        <Upload
                            name="image"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={handleImageUpload}
                            fileList={fileList}
                        >
                            <Button icon={<UploadOutlined />}>{t('foodOption.editModal.buttons.uploadImage')}</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {t('foodOption.editModal.buttons.updateOption')}
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

export default EditFoodOptionModal;
