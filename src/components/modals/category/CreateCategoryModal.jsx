import React, { useState } from "react";
import { App, Button, Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../service/axios";
import { apiEndPoints } from "../../../constaints/apiEndPoint";

const CreateCategoryModal = ({ open, onClose, onCategoryCreated }) => {
    const { t } = useTranslation('global');
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [isFetching, setIsFetching] = useState(false);

    const handleCreate = async (values) => {
        setIsFetching(true);
        try {
            await axiosInstance.post(apiEndPoints.CATEGORY.CREATE, values);
            message.success(t("category.categoryCreationModal.messages.createSuccess"));
            onCategoryCreated();
            onClose();
            form.resetFields();
        } catch (error) {
            message.error(t("category.categoryCreationModal.messages.createError"));
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <Modal
            title={t("category.categoryCreationModal.titles.modalTitle")}
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <Form layout="vertical" form={form} onFinish={handleCreate}>
                <Form.Item
                    label={t("category.categoryCreationModal.labels.name")}
                    name="name"
                    rules={[
                        { required: true, message: t("category.categoryCreationModal.messages.rules.nameRequired") },
                        { max: 50, message: t("category.categoryCreationModal.messages.rules.nameMaxLength") },
                    ]}
                >
                    <Input placeholder={t("category.categoryCreationModal.placeholders.name")} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isFetching}>
                        {t("category.categoryCreationModal.buttons.create")}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateCategoryModal;