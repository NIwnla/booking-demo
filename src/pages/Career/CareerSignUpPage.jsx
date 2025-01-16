import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Upload } from "antd";
import React from "react";
import { useTranslation } from "react-i18next"; // Import translation hook
import { apiEndPoints } from "../../constaints/apiEndPoint";
import axiosInstance from "../../service/axios";

const CareerSignUpPage = () => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const { t } = useTranslation("global"); // Initialize translation

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("email", values.email);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("socialNumber", values.socialNumber);
        formData.append("resumeFile", values.resumeFile[0].originFileObj);
        if (values.currentEducation) {
            formData.append("currentEducation", values.currentEducation);
        }
        try {
            await axiosInstance.post(apiEndPoints.RECRUIT_INFORMATION.CREATE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            message.success(t("career.form.messages.success"));
            form.resetFields();
        } catch (error) {
            message.error(t("career.form.messages.error"));
        }
    };

    const handleFailedSubmit = () => {
        message.error(t("career.form.messages.formError"));
    };

    const validateFile = (file) => {
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedTypes.includes(file.type)) {
            message.error(t("career.form.resumeFile.invalid"));
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    return (
        <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
            <h2>{t("career.form.title")}</h2>
            <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
                onFinishFailed={handleFailedSubmit}
            >
                <Form.Item
                    label={t("career.form.firstName.label")}
                    name="firstName"
                    rules={[
                        { required: true, message: t("career.form.firstName.required") },
                        { max: 50, message: t("career.form.firstName.maxLength") },
                    ]}
                >
                    <Input placeholder={t("career.form.firstName.placeholder")} />
                </Form.Item>

                <Form.Item
                    label={t("career.form.lastName.label")}
                    name="lastName"
                    rules={[
                        { required: true, message: t("career.form.lastName.required") },
                        { max: 50, message: t("career.form.lastName.maxLength") },
                    ]}
                >
                    <Input placeholder={t("career.form.lastName.placeholder")} />
                </Form.Item>

                <Form.Item
                    label={t("career.form.email.label")}
                    name="email"
                    rules={[
                        { required: true, message: t("career.form.email.required") },
                        { type: "email", message: t("career.form.email.invalid") },
                    ]}
                >
                    <Input placeholder={t("career.form.email.placeholder")} />
                </Form.Item>

                <Form.Item
                    label={t("career.form.phoneNumber.label")}
                    name="phoneNumber"
                    rules={[
                        { required: true, message: t("career.form.phoneNumber.required") },
                        { pattern: /^\d{9,10}$/, message: t("career.form.phoneNumber.pattern") },
                    ]}
                >
                    <Input placeholder={t("career.form.phoneNumber.placeholder")} />
                </Form.Item>

                <Form.Item
                    label={t("career.form.socialNumber.label")}
                    name="socialNumber"
                    rules={[
                        { required: true, message: t("career.form.socialNumber.required") },
                        { pattern: /^\d{12}$/, message: t("career.form.socialNumber.pattern") },
                    ]}
                >
                    <Input placeholder={t("career.form.socialNumber.placeholder")} />
                </Form.Item>

                <Form.Item
                    label={t("career.form.currentEducation.label")}
                    name="currentEducation"
                >
                    <Input placeholder={t("career.form.currentEducation.placeholder")} />
                </Form.Item>

                <Form.Item
                    label={t("career.form.resumeFile.label")}
                    name="resumeFile"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                    rules={[{ required: true, message: t("career.form.resumeFile.required") }]}
                >
                    <Upload
                        name="resumeFile"
                        listType="text"
                        maxCount={1}
                        beforeUpload={validateFile}
                    >
                        <Button icon={<UploadOutlined />}>
                            {t("career.form.resumeFile.label")}
                        </Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {t("career.form.submitButton")}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CareerSignUpPage;
