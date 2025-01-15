import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Upload } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { apiEndPoints } from "../../constaints/apiEndPoint";
import axiosInstance from "../../service/axios";

const CareerSignUpPage = () => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const { t } = useTranslation("global"); // Use the "global" namespace for translations

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("email", values.email);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("socialNumber", values.socialNumber);
        formData.append("resumeFile", values.ResumeFile[0].originFileObj);
        if (values.currentEducation) {
            formData.append("currentEducation", values.currentEducation);
        }
        try {
            await axiosInstance.post(apiEndPoints.RECRUIT_INFORMATION.CREATE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            message.success(t("careerForm.successMessage"));
            form.resetFields();
        } catch (error) {
            message.error(t("careerForm.errorMessage"));
        }
    };

    const handleFailedSubmit = (errorInfo) => {
        message.error(t("careerForm.formError"));
    };

    const validateFile = (file) => {
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedTypes.includes(file.type)) {
            message.error(t("careerForm.resumeFileInvalid"));
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    return (
        <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
            <h2>{t("careerForm.title")}</h2>
            <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
                onFinishFailed={handleFailedSubmit}
            >
                <Form.Item
                    label={t("careerForm.firstName")}
                    name="firstName"
                    rules={[
                        { required: true, message: t("careerForm.firstNameRequired") },
                        { max: 50, message: t("careerForm.firstNameMaxLength") },
                    ]}
                >
                    <Input placeholder={t("careerForm.firstName")} />
                </Form.Item>
                <Form.Item
                    label={t("careerForm.lastName")}
                    name="lastName"
                    rules={[
                        { required: true, message: t("careerForm.lastNameRequired") },
                        { max: 50, message: t("careerForm.lastNameMaxLength") },
                    ]}
                >
                    <Input placeholder={t("careerForm.lastName")} />
                </Form.Item>
                <Form.Item
                    label={t("careerForm.email")}
                    name="email"
                    rules={[
                        { required: true, message: t("careerForm.emailRequired") },
                        { type: "email", message: t("careerForm.emailInvalid") },
                    ]}
                >
                    <Input placeholder={t("careerForm.email")} />
                </Form.Item>
                <Form.Item
                    label={t("careerForm.phoneNumber")}
                    name="phoneNumber"
                    rules={[
                        { required: true, message: t("careerForm.phoneNumberRequired") },
                        {
                            pattern: /^\d{9,10}$/,
                            message: t("careerForm.phoneNumberPattern"),
                        },
                    ]}
                >
                    <Input placeholder={t("careerForm.phoneNumber")} />
                </Form.Item>
                <Form.Item
                    label={t("careerForm.socialNumber")}
                    name="socialNumber"
                    rules={[
                        { required: true, message: t("careerForm.socialNumberRequired") },
                        {
                            pattern: /^\d{12}$/,
                            message: t("careerForm.socialNumberPattern"),
                        },
                    ]}
                >
                    <Input placeholder={t("careerForm.socialNumber")} />
                </Form.Item>
                <Form.Item
                    label={t("careerForm.currentEducation")}
                    name="currentEducation"
                >
                    <Input placeholder={t("careerForm.currentEducationPlaceholder")} />
                </Form.Item>
                <Form.Item
                    label={t("careerForm.resumeFile")}
                    name="ResumeFile"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                        return Array.isArray(e) ? e : e?.fileList;
                    }}
                    rules={[{ required: true, message: t("careerForm.resumeFileRequired") }]}
                >
                    <Upload
                        name="ResumeFile"
                        listType="text"
                        maxCount={1}
                        beforeUpload={validateFile}
                    >
                        <Button icon={<UploadOutlined />}>{t("careerForm.resumeFile")}</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {t("careerForm.submitButton")}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CareerSignUpPage;
