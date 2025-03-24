import { DeleteOutlined, EditOutlined, PlusOutlined, ZoomInOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import { routeNames } from '../../../constaints/routeName';
import axiosInstance from '../../../service/axios';
import JobTypeFilterBox from './components/JobTypeFilterBox';

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
                const response = await axiosInstance.get(apiEndPoints.JOB_OFFER.GET_ALL_ADMIN, {
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
            width: '25%',
            ellipsis: true,
            responsive: ['lg'],
        },
        {
            title: 'Recruitment',
            dataIndex: 'recruitNumber',
            key: 'recruitNumber',
            responsive: ['lg'],
            width: '10%',
            render: (recruitNumber) => (
                <Tag color={recruitNumber === 0 ? 'red' : 'green'}>
                    {recruitNumber} positions
                </Tag>
            ),
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
                        onClick={() => navigate(`${routeNames.jobOffer.detail}${record.id}`)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        type="primary"
                        ghost
                        onClick={() => navigate(`${routeNames.jobOffer.edit}${record.id}`)}
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
        <>
            <Helmet>
                <title>Job Offers Management - Nollowa Chicken Admin</title>
                <meta name="description" content="Manage job postings and opportunities" />
            </Helmet>
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
                            onClick={() => navigate(routeNames.jobOffer.create)}
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
        </>
    );
};

export default JobOfferManagementPage;