import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Upload } from "antd";
import React from "react";
import { apiEndPoints } from "../../constaints/apiEndPoint";
import axiosInstance from "../../service/axios";

const CareerSignUpPage = () => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("email", values.email);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("resumeFile", values.ResumeFile[0].originFileObj);

        try {
            await axiosInstance.post(apiEndPoints.RECRUIT_INFORMATION.CREATE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            message.success("Your application has been submitted successfully!");
            form.resetFields();
        } catch (error) {
            message.error("Failed to submit your application.");
        }
    };

    const handleFailedSubmit = (errorInfo) => {
        message.error("Please check the form fields and try again.");
    };

    const validateFile = (file) => {
        const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (!allowedTypes.includes(file.type)) {
            message.error("Only Word or PDF files are allowed.");
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    return (
        <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
            <h2>Career Sign-Up</h2>
            <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
                onFinishFailed={handleFailedSubmit}
            >
                <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[
                        { required: true, message: "Please enter your first name" },
                        { max: 50, message: "First name cannot exceed 50 characters" },
                    ]}
                >
                    <Input placeholder="Enter your first name" />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[
                        { required: true, message: "Please enter your last name" },
                        { max: 50, message: "Last name cannot exceed 50 characters" },
                    ]}
                >
                    <Input placeholder="Enter your last name" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Please enter a valid email address" },
                    ]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>
                <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                        { required: true, message: "Please enter your phone number" },
                        {
                            pattern: /^\d{9,10}$/,
                            message: "Phone number must be 9 to 10 digits long",
                        },
                    ]}
                >
                    <Input placeholder="Enter your phone number" />
                </Form.Item>
                <Form.Item
                    label="Resume"
                    name="ResumeFile"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                        return Array.isArray(e) ? e : e?.fileList;
                    }}
                    rules={[{ required: true, message: "Please upload your resume" }]}
                >
                    <Upload
                        name="ResumeFile"
                        listType="text"
                        maxCount={1}
                        beforeUpload={validateFile}
                    >
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit Application
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CareerSignUpPage;
