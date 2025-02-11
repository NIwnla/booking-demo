import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Modal, Upload } from "antd";
import React, { useState } from "react";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import axiosInstance from "../../../service/axios";
import { useTranslation } from "react-i18next";

const EditFoodOptionModal = ({ visible, onClose, option, onOptionUpdated, foodId }) => {
    const { t } = useTranslation('global');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    const handleFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("NameVN", values.nameVN);
        formData.append("NameEN", values.nameEN);
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
                initialValues={{
                    nameVN: option.nameVN,
                    nameEN: option.nameEN,
                    price: option.price,
                }}
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
                        beforeUpload={() => false} // Prevent automatic upload
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
    );
};

export default EditFoodOptionModal;
