import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Typography, Card, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ZoomInOutlined } from '@ant-design/icons';
import JobTypeFilterBox from './components/JobTypeFilterBox';
import axiosInstance from '../../../service/axios';
import { useTranslation } from 'react-i18next';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import { useNavigate } from 'react-router-dom';
import { routeNames } from '../../../constaints/routeName';

const { Title } = Typography;

const JobOfferManagementPage = () => {
    const [jobOffers, setJobOffers] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [loading, setLoading] = useState(false);
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobOffers = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(apiEndPoints.JOB_OFFER.GET_ALL, {
                    params: {
                        typeId: selectedType
                    }
                });
                setJobOffers(response.data);
            } catch (error) {
                console.error('Error fetching job offers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobOffers();
    }, [selectedType]);

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await axiosInstance.delete(`${apiEndPoints.JOB_OFFER.DELETE}/${id}`);
            const response = await axiosInstance.get(apiEndPoints.JOB_OFFER.GET_ALL, {
                params: {
                    type: selectedType
                }
            });
            setJobOffers(response.data);
        } catch (error) {
            console.error('Error deleting job offer:', error);
        } finally {
            setLoading(false);
        }
    };

    // Remove client-side filtering
    const columns = [
        {
            title: 'Job Title',
            key: 'name',
            width: '20%',
            render: (_, record) => {
                return i18n.language === 'vi' ? record.nameVN : record.nameEN;
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: '15%',
        },
        {
            title: 'Description',
            dataIndex: 'shortDescription',
            key: 'shortDescription',
            width: '35%',
            ellipsis: true,
            responsive: ['lg'],
        },
        {
            title: 'Employment',
            dataIndex: 'isFullTime',
            key: 'isFullTime',
            width: '15%',
            render: (isFullTime) => (
                <Tag color={isFullTime ? 'blue' : 'orange'}>
                    {isFullTime ? 'Full Time' : 'Part Time'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '15%',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<ZoomInOutlined />}
                        type="default"
                        onClick={() => navigate(`/career/detail/admin/${record.id}`)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        type="primary"
                        ghost
                        onClick={() => navigate(`/career/edit/${record.id}`)}
                    />
                    <Popconfirm
                        title="Delete this job offer?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '3vh 10vw' }}>
            <Card>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <Title level={2} style={{ margin: 0 }}>Job Offers Management</Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate(routeNames.career.create)}
                    >
                        Create New Job Offer
                    </Button>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <JobTypeFilterBox onTypeChange={value => setSelectedType(value)} />
                </div>

                <Table
                    // @ts-ignore
                    columns={columns}
                    dataSource={jobOffers}
                    rowKey="id"
                    pagination={false}
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default JobOfferManagementPage;