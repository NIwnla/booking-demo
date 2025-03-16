import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { App, Button, Card, Col, Form, Input, Row, Typography, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { routeNames } from '../../../constaints/routeName';
import axiosInstance from '../../../service/axios';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import CareerNavBar from '../components/CareerNavBar';

const { Title, Paragraph } = Typography;

const JobOfferDetail = () => {
    const { id } = useParams();
    const { i18n } = useTranslation();
    const [jobOffer, setJobOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    useEffect(() => {
        const fetchJobOffer = async () => {
            try {
                const response = await axiosInstance.get(apiEndPoints.JOB_OFFER.GET_BY_ID(id));
                setJobOffer(response.data);
            } catch (error) {
                console.error('Error fetching job offer:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobOffer();
    },[]);

    if (loading) return <div>Loading...</div>;
    if (!jobOffer) return <div>Job offer not found</div>;

    const infoItems = [
        { label: 'Employment Type', value: jobOffer.isFullTime ? 'Full Time' : 'Part Time' },
        { label: 'Working Address', value: jobOffer.workingAddress },
        { label: 'Application Time', value: jobOffer.applicationTime },
        { label: 'Department', value: jobOffer.department },
        { label: 'Salary', value: i18n.language === 'vi' ? jobOffer.salaryVN : jobOffer.salaryEN },
    ];

    const jobTitle = i18n.language === 'vi' ? jobOffer.nameVN : jobOffer.nameEN;

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("email", values.email);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("socialNumber", values.socialNumber);
        formData.append("resume", values.resume[0].originFileObj);
        formData.append("jobOfferId", id);
        if (values.currentEducation) {
            formData.append("currentEducation", values.currentEducation);
        }

        try {
            await axiosInstance.post(apiEndPoints.RECRUIT_INFORMATION.CREATE, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            message.success('Application submitted successfully!');
            form.resetFields();
        } catch (error) {
            message.error('Failed to submit application');
        }
    };

    const validateFile = (file) => {
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedTypes.includes(file.type)) {
            message.error('Please upload PDF or Word documents only');
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <CareerNavBar selected="find-jobs" />
            <div style={{ padding: '150px 5vw' }}>
                <Card>
                    <Title level={2}>{jobTitle}</Title>
                    <Paragraph style={{ marginBottom: '24px' }}>
                        {jobOffer.shortDescription}
                    </Paragraph>

                    <Row gutter={[24, 24]}>
                        <Col md={24} lg={16}>
                            <Card title="Job Description">
                                <div
                                    dangerouslySetInnerHTML={{ __html: jobOffer.description }}
                                    style={{
                                        fontSize: '1.25rem',
                                        padding: '12px'
                                    }}
                                />
                            </Card>
                        </Col>
                        <Col md={24} lg={8}>
                            <Button
                                type="primary"
                                size="large"
                                style={{
                                    marginBottom: '2rem',
                                    background: '#1a365d',
                                    width: '100%'
                                }}
                                onClick={() => {
                                    document.getElementById('applicationForm').scrollIntoView({
                                        behavior: 'smooth'
                                    });
                                }}
                            >
                                Apply Now
                            </Button>
                            <Card title="Job Details" style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {infoItems.map((item, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                borderBottom: index !== infoItems.length - 1 ? '2px solid #f0f0f0' : 'none',
                                                paddingBottom: '16px'
                                            }}
                                        >
                                            <div style={{
                                                minWidth: '150px',
                                                fontWeight: 'bold',
                                                color: '#666',
                                                paddingRight: '16px',
                                                wordBreak: 'break-word'
                                            }}>
                                                {item.label}
                                            </div>
                                            <div style={{
                                                flex: 1,
                                                wordBreak: 'break-word'
                                            }}>
                                                {item.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <Card id="applicationForm">
                                <Title level={2} style={{ marginBottom: '2rem' }}>
                                    Input Application Form
                                </Title>

                                <Form
                                    layout="vertical"
                                    form={form}
                                    onFinish={handleSubmit}
                                >
                                    <Form.Item
                                        label="First Name"
                                        name="firstName"
                                        rules={[
                                            { required: true, message: 'Please input your first name!' },
                                            { max: 50, message: 'First name cannot exceed 50 characters!' },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Last Name"
                                        name="lastName"
                                        rules={[
                                            { required: true, message: 'Please input your last name!' },
                                            { max: 50, message: 'Last name cannot exceed 50 characters!' },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Please input your email!' },
                                            { type: 'email', message: 'Please enter a valid email!' },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Phone Number"
                                        name="phoneNumber"
                                        rules={[
                                            { required: true, message: 'Please input your phone number!' },
                                            { pattern: /^\d{9,10}$/, message: 'Please enter a valid phone number!' },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Social Number"
                                        name="socialNumber"
                                        rules={[
                                            { required: true, message: 'Please input your social number!' },
                                            { pattern: /^\d{12}$/, message: 'Please enter a valid 12-digit social number!' },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Current Education"
                                        name="currentEducation"
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Resume"
                                        name="resume"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                                        rules={[{ required: true, message: 'Please upload your resume!' }]}
                                    >
                                        <Upload
                                            name="resume"
                                            listType="text"
                                            maxCount={1}
                                            beforeUpload={validateFile}
                                        >
                                            <Button icon={<UploadOutlined />}>Upload Resume</Button>
                                        </Upload>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" size="large">
                                            Submit Application
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>

                    <div style={{ marginTop: '24px' }}>
                        <Link to={routeNames.career.findJobs}>
                            <Button icon={<ArrowLeftOutlined />}>
                                Back to Job Offers
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default JobOfferDetail;