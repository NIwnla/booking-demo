import React, { useEffect, useState } from 'react';
import { Select, Modal, Input, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../../service/axios';
import { apiEndPoints } from '../../../constaints/apiEndPoint';

const BranchLocationFilterBox = ({ onLocationChange, defaultValue = null }) => {
    const [locations, setLocations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const fetchLocations = async () => {
        try {
            const response = await axiosInstance.get(apiEndPoints.BRANCH_LOCATION.GET_ALL);
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching branch locations:', error);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleCreateLocation = async (values) => {
        try {
            setLoading(true);
            await axiosInstance.post(apiEndPoints.BRANCH_LOCATION.CREATE, {
                name: values.name
            });
            message.success('Branch location created successfully');
            await fetchLocations();
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Failed to create branch location');
            console.error('Error creating branch location:', error);
        } finally {
            setLoading(false);
        }
    };

    const options = [
        ...locations.map(location => ({
            value: location.id,
            label: location.name
        })),
        {
            value: 'create',
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlusOutlined />
                    Create New Location
                </div>
            )
        }
    ];

    const handleSelectChange = (value) => {
        if (value === 'create') {
            setIsModalOpen(true);
            return;
        }
        onLocationChange(value);
    };

    return (
        <>
            <Select
                allowClear
                placeholder="Filter by branch location"
                style={{ width: '200px' }}
                onChange={handleSelectChange}
                options={options}
                defaultValue={defaultValue}
            />

            <Modal
                title="Create New Branch Location"
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
                    onFinish={handleCreateLocation}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Location Name"
                        rules={[
                            { required: true, message: 'Please input the location name!' },
                            { max: 100, message: 'Location name cannot exceed 100 characters!' }
                        ]}
                    >
                        <Input placeholder="Enter branch location name" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default BranchLocationFilterBox;