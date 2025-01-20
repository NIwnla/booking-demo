import { App, Button, Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import axiosInstance from "../../../service/axios";

const EditCategoryModal = ({ open, onClose, category, onCategoryUpdated }) => {
    const { t } = useTranslation('global');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    useEffect(() => {
        if (category) {
            form.setFieldsValue({
                name: category.name,
                description: category.description,
            });
        }
    }, [category]);

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            await axiosInstance.put(apiEndPoints.CATEGORY.EDIT(category.id), values);
            message.success(t("category.categoryEditModal.messages.updateSuccess"));
            onCategoryUpdated();
            onClose();
            form.resetFields();
        } catch (error) {
            message.error(t("category.categoryEditModal.messages.updateError"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={t("category.categoryEditModal.titles.modalTitle")}
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    name="name"
                    label={t("category.categoryEditModal.labels.name")}
                    rules={[
                        { required: true, message: t("category.categoryEditModal.messages.rules.nameRequired") },
                        { max: 50, message: t("category.categoryEditModal.messages.rules.nameMaxLength") },
                    ]}
                >
                    <Input placeholder={t("category.categoryEditModal.placeholders.name")} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {t("category.categoryEditModal.buttons.updateCategory")}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditCategoryModal;