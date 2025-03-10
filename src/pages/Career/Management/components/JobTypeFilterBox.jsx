import React, { useEffect, useState } from 'react';
import { Select, Modal, Input, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../../../service/axios';
import { apiEndPoints } from '../../../../constaints/apiEndPoint';

const JobTypeFilterBox = ({ onTypeChange, defaultValue = null }) => {
    const [jobTypes, setJobTypes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const fetchJobTypes = async () => {
        try {
            const response = await axiosInstance.get(apiEndPoints.JOB_TYPE.GET_ALL);
            setJobTypes(response.data);
        } catch (error) {
            console.error('Error fetching job types:', error);
        }
    };

    useEffect(() => {
        fetchJobTypes();
    }, []);

    const handleCreateType = async (values) => {
        try {
            setLoading(true);
            await axiosInstance.post(apiEndPoints.JOB_TYPE.CREATE, {
                name: values.name
            });
            message.success('Job type created successfully');
            await fetchJobTypes();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Failed to create job type');
            console.error('Error creating job type:', error);
        } finally {
            setLoading(false);
        }
    };

    const options = [
        ...jobTypes.map(type => ({
            value: type.id,
            label: type.name
        })),
        {
            value: 'create',
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlusOutlined />
                    Create New Type
                </div>
            )
        }
    ];

    const handleSelectChange = (value) => { 
        if (value === 'create') {
            setIsModalOpen(true);
            return;
        }
        onTypeChange(value);
    };

    return (
        <>
            <Select
                allowClear
                placeholder="Filter by job type"
                style={{ width: '200px' }}
                onChange={handleSelectChange}
                options={options}
                defaultValue={defaultValue}
            />

            <Modal
                title="Create New Job Type"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    onFinish={handleCreateType}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Type Name"
                        rules={[
                            { required: true, message: 'Please input the type name!' },
                            { max: 100, message: 'Type name cannot exceed 100 characters!' }
                        ]}
                    >
                        <Input placeholder="Enter job type name" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default JobTypeFilterBox;