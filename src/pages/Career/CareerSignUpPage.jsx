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
            message.success("Đơn ứng tuyển của bạn đã được gửi thành công!");
            form.resetFields();
        } catch (error) {
            message.error("Gửi đơn ứng tuyển thất bại.");
        }
    };

    const handleFailedSubmit = (errorInfo) => {
        message.error("Vui lòng kiểm tra lại các trường trong biểu mẫu và thử lại.");
    };

    const validateFile = (file) => {
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedTypes.includes(file.type)) {
            message.error("Chỉ cho phép tệp Word hoặc PDF.");
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    return (
        <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
            <h2>Đăng ký tuyển dụng</h2>
            <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
                onFinishFailed={handleFailedSubmit}
            >
                <Form.Item
                    label="Họ"
                    name="firstName"
                    rules={[
                        { required: true, message: "Vui lòng nhập họ của bạn" },
                        { max: 50, message: "Họ không được vượt quá 50 ký tự" },
                    ]}
                >
                    <Input placeholder="Nhập họ của bạn" />
                </Form.Item>
                <Form.Item
                    label="Tên"
                    name="lastName"
                    rules={[
                        { required: true, message: "Vui lòng nhập tên của bạn" },
                        { max: 50, message: "Tên không được vượt quá 50 ký tự" },
                    ]}
                >
                    <Input placeholder="Nhập tên của bạn" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email của bạn" },
                        { type: "email", message: "Vui lòng nhập một địa chỉ email hợp lệ" },
                    ]}
                >
                    <Input placeholder="Nhập email của bạn" />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại của bạn" },
                        {
                            pattern: /^\d{9,10}$/,
                            message: "Số điện thoại phải có từ 9 đến 10 chữ số",
                        },
                    ]}
                >
                    <Input placeholder="Nhập số điện thoại của bạn" />
                </Form.Item>
                <Form.Item
                    label="Căn cước công dân"
                    name="socialNumber"
                    rules={[
                        { required: true, message: "Vui lòng nhập số căn cước công dân của bạn" },
                        {
                            pattern: /^\d{12}$/,
                            message: "Căn cước công dân phải có đúng 12 chữ số",
                        },
                    ]}
                >
                    <Input placeholder="Nhập số căn cước công dân của bạn" />
                </Form.Item>
                <Form.Item
                    label="Trường đang theo học hiện tại"
                    name="currentEducation"
                >
                    <Input placeholder="Nhập tên trường đang theo học (nếu có)" />
                </Form.Item>
                <Form.Item
                    label="Hồ sơ ứng tuyển"
                    name="ResumeFile"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                        return Array.isArray(e) ? e : e?.fileList;
                    }}
                    rules={[{ required: true, message: "Vui lòng tải lên hồ sơ của bạn" }]}
                >
                    <Upload
                        name="ResumeFile"
                        listType="text"
                        maxCount={1}
                        beforeUpload={validateFile}
                    >
                        <Button icon={<UploadOutlined />}>Chọn tệp</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Gửi đơn ứng tuyển
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CareerSignUpPage;
