import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Switch, Typography, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { routeNames } from '../../../constaints/routeName';
import axiosInstance from '../../../service/axios';
import JobTypeFilterBox from '../components/JobTypeFilterBox';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import EditJobTypeFilterBox from '../components/EditJobTypeFilterBox';

const { Title } = Typography;

const EditJobOffer = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchJobOffer = async () => {
            try {
                const response = await axiosInstance.get(apiEndPoints.JOB_OFFER.GET_BY_ID(id));
                form.setFieldsValue({
                    ...response.data,
                    typeId: response.data.typeId
                });
            } catch (error) {
                message.error('Failed to fetch job offer');
                console.error('Error fetching job offer:', error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchJobOffer();
    }, [id, form]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await axiosInstance.put(`job-offers/${id}`, values);
            message.success('Job offer updated successfully');
            navigate(routeNames.career.management);
        } catch (error) {
            message.error('Failed to update job offer');
            console.error('Error updating job offer:', error);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <Title level={2}>Edit Job Offer</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ maxWidth: 800 }}
                >
                    <Form.Item
                        label="Job Title (Vietnamese)"
                        name="nameVN"
                        rules={[{ required: true, message: 'Please input the Vietnamese job title!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Job Title (English)"
                        name="nameEN"
                        rules={[{ required: true, message: 'Please input the English job title!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Short Description"
                        name="shortDescription"
                        rules={[{ required: true, message: 'Please input the short description!' }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Job Type"
                        name="typeId"
                        rules={[{ required: true, message: 'Please select a job type!' }]}
                    >
                        <EditJobTypeFilterBox 
                            onTypeChange={(value) => form.setFieldValue('typeId', value)}
                            defaultValue={() => form.getFieldValue('typeId')}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Employment Type"
                        name="isFullTime"
                        valuePropName="checked"
                    >
                        <Switch 
                            checkedChildren="Full Time" 
                            unCheckedChildren="Part Time"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Working Address"
                        name="workingAddress"
                        rules={[{ required: true, message: 'Please input the working address!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Application Time"
                        name="applicationTime"
                        rules={[{ required: true, message: 'Please input the application time!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Department"
                        name="department"
                        rules={[{ required: true, message: 'Please input the department!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Salary (Vietnamese)"
                        name="salaryVN"
                        rules={[{ required: true, message: 'Please input the Vietnamese salary!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Salary (English)"
                        name="salaryEN"
                        rules={[{ required: true, message: 'Please input the English salary!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Full Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the full description!' }]}
                    >
                        <ReactQuill 
                            theme="snow"
                            style={{ height: '300px', marginBottom: '50px' }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Update Job Offer
                        </Button>
                        <Button 
                            style={{ marginLeft: '10px' }}
                            onClick={() => navigate(routeNames.career.management)}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EditJobOffer;