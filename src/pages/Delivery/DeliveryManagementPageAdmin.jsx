import { App, Button, Layout, Modal, Pagination, Select, Space, Table, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import axiosInstance from '../../service/axios';

const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const DeliveryManagementPageAdmin = () => {
    const [data, setData] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const { message } = App.useApp();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.DELIVERY_INFORMATION.GET_ALL, {
                params: {
                    pageIndex,
                    pageSize,
                    status: statusFilter,
                },
            });
            setData(response.data.items);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDataById = async (id) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.DELIVERY_INFORMATION.GET_BY_ID(id));
            setSelectedDelivery(response.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, statusFilter]);

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setPageIndex(1);
    };

    const showDetailModal = (delivery) => {
        fetchDataById(delivery.id);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedDelivery(null);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axiosInstance.delete(apiEndPoints.DELIVERY_INFORMATION.DELETE(id));
            message.success('Delivery information deleted successfully!');
            fetchData();
        } catch (error) {
            console.error('Error deleting delivery information:', error);
            message.error('An error occurred while deleting delivery information.');
        }
    };


    const columns = [
        {
            title: 'User Name',
            dataIndex: 'userFullName',
            key: 'userFullName',
        },
        {
            title: 'Email',
            dataIndex: 'username',
            key: 'username',
            responsive: ['lg'],
            ellipsis: true,
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            responsive: ['md'],
            ellipsis: true,
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            responsive: ['lg'],
        },
        {
            title: 'Status',
            dataIndex: 'bookingStatus',
            key: 'bookingStatus',
            responsive: ['sm'],
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space wrap>
                    <Button type="link" onClick={() => showDetailModal(record)}>Detail</Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        }

    ];

    return (
        <Content style={{ padding: '20px' }}>
            <Title level={3}>Delivery Management</Title>
            <div style={styles.searchFilterContainer}>
                <Select
                    placeholder="Filter by Status"
                    style={{ width: '100%' }}
                    onChange={handleStatusChange}
                    value={statusFilter}
                    allowClear
                >
                    <Option value={undefined}>All</Option>
                    <Option value={0}>Cancelled</Option>
                    <Option value={1}>Standby</Option>
                    <Option value={2}>Delivering</Option>
                    <Option value={3}>Delivered</Option>
                </Select>
            </div>

            <Table
                // @ts-ignore
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={false}
                loading={loading}
            />
            <Pagination
                current={pageIndex}
                pageSize={pageSize}
                total={totalCount}
                onChange={(page) => setPageIndex(page)}
                simple={window.innerWidth < 768}
                style={{ marginTop: '20px', textAlign: 'center' }}
            />

            <Modal
                title="Delivery Details"
                open={isModalVisible}
                onCancel={handleModalClose}
                width={window.innerWidth < 768 ? '100%' : '600px'}
                footer={[<Button key="close" onClick={handleModalClose}>Close</Button>]}
            >
                {loading ? (
                    <p>Loading...</p>
                ) : selectedDelivery && (
                    <div>
                        <p><strong>User Name:</strong> {selectedDelivery.userFullName}</p>
                        <p><strong>Email:</strong> {selectedDelivery.username}</p>
                        <p><strong>Location:</strong> {selectedDelivery.location}</p>
                        <p><strong>Phone Number:</strong> {selectedDelivery.phoneNumber}</p>
                        <p><strong>Status:</strong> {selectedDelivery.bookingStatus}</p>
                        <p><strong>Food:</strong> {selectedDelivery.food}</p>
                        {selectedDelivery.message && <p><strong>Message:</strong> {selectedDelivery.message}</p>}
                    </div>
                )}
            </Modal>
        </Content>
    );
};

export default DeliveryManagementPageAdmin;

const styles = {
    searchFilterContainer: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        marginBottom: '20px',
    },
};
