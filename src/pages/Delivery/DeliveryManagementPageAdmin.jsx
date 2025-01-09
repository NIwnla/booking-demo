import { App, Button, Card, Col, Layout, Modal, Pagination, Row, Select, Space, Spin, Table, Tag, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import axiosInstance from '../../service/axios';
import dayjs from 'dayjs';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { useWindowSize } from '../../helpers/useWindowSize';

const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const DeliveryManagementPageAdmin = () => {
    const [data, setData] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const { message } = App.useApp();

    const windowSize = useWindowSize();

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

    const handleUpdate = async (id, status) => {
        try {
            const response = await axiosInstance.put(apiEndPoints.DELIVERY_INFORMATION.EDIT_STATUS(id, status));
            message.success('Delivery information updated successfully!');
            fetchData();
        } catch (error) {
            console.error('Error updating delivery information:', error);
            message.error('An error occurred while updating delivery information.');
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
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            responsive: ['md'],
            ellipsis: true,
            render: (time) => {
                const formattedTime = dayjs(time).utc().local().format('MM/DD HH:mm');
                return formattedTime;
            },
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
            dataIndex: 'status',
            key: 'status',
            responsive: ['sm'],
            render: (status) => {
                let color;
                switch (status) {
                    case 'Cancelled':
                        color = 'red';
                        break;
                    case 'Standby':
                        color = 'orange';
                        break;
                    case 'Delivering':
                        color = 'blue';
                        break;
                    case 'Delivered':
                        color = 'green';
                        break;
                    default:
                        color = 'gray';
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space wrap>
                    <Button type="link" onClick={() => showDetailModal(record)} >Detail</Button>
                    {record.status === 'Standby' && (
                        <Button
                            type="link"
                            onClick={() => handleUpdate(record.id, 2)}
                        >
                            Assign
                        </Button>
                    )}
                    {record.status !== 'Delivered' && (
                        <Button
                            type="link"
                            onClick={() => handleUpdate(record.id, 0)}
                            danger
                        >
                            Cancel
                        </Button>
                    )}
                </Space>
            ),
        }

    ];

    return (
        <Content style={{ padding: '20px' }}>
            <Title level={3}>Delivery Management</Title>
            <div style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                marginBottom: '20px',
            }}>
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
                simple={windowSize.width < 768}
                style={{ marginTop: '20px', textAlign: 'center' }}
            />

            <Modal
                title="Delivery Details"
                open={isModalVisible}
                onCancel={handleModalClose}
                width={windowSize.width < 768 ? '100%' : '70vw'}
                footer={[<Button key="close" onClick={handleModalClose}>Close</Button>]}>
                {loading ? (
                    <Spin />
                ) : selectedDelivery && (
                    <div>
                        <p><strong>User Name:</strong> {selectedDelivery.userFullName}</p>
                        <p><strong>Email:</strong> {selectedDelivery.username}</p>
                        <p><strong>Time:</strong> {dayjs(selectedDelivery.time).format('MM/DD HH:mm')}</p>
                        <p><strong>Location:</strong> {selectedDelivery.location}</p>
                        <p><strong>Phone Number:</strong> {selectedDelivery.phoneNumber}</p>
                        <p><strong>Status:</strong> {selectedDelivery.status}</p>
                        {selectedDelivery.message && <p><strong>Message:</strong> {selectedDelivery.message}</p>}

                            <div
                                style={{
                                    display: windowSize.width < 768 ? 'block' : 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '20px',
                                }}
                            >
                                <Title level={4} style={{ margin: 0, width: windowSize.width < 768 ? '100%' : 'auto' }}>
                                    Foods:
                                </Title>
                                <Title level={5} style={{ margin: 0, width: windowSize.width < 768 ? '100%' : 'auto' }}>
                                    Total: {selectedDelivery.preOrderItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} VND
                                </Title>
                            </div>

                        <Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
                            {selectedDelivery.preOrderItems.map(item => (
                                <Col key={item.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                                    <Card
                                        cover={
                                            <img
                                                alt={item.name}
                                                src={`${AxiosConstants.AXIOS_BASEURL}/${item.imagePath}`}
                                                style={{ height: '150px', objectFit: 'cover' }}
                                            />
                                        }
                                        bordered
                                    >
                                        <Card.Meta
                                            title={item.name}
                                            description={
                                                <>
                                                    <p>{item.price.toLocaleString()} VND</p>
                                                    <p>Quantity: {item.quantity}</p>
                                                </>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </Modal>

        </Content>
    );
};

export default DeliveryManagementPageAdmin;
