import { Button, Card, Col, Image, Input, Layout, Modal, Pagination, Row, Select, Space, Spin, Table, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { useWindowSize } from '../../helpers/useWindowSize';
import axiosInstance from '../../service/axios';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const BookingManagementAdminPage = () => {
    const [data, setData] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const windowSize = useWindowSize();

    const getFormattedTime = (time) => {
        const date = dayjs(time);
        if (windowSize.width <= 576) {
            return date.format('HH:mm');
        } else if (windowSize.width <= 768) {
            return date.format('DD HH:mm');
        } else {
            return date.format('YYYY/MM/DD HH:mm');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.BOOKING_INFORMATION.GET_ALL, {
                params: {
                    pageIndex,
                    pageSize,
                    search: searchTerm,
                    statusFilter: statusFilter === -1 ? undefined : statusFilter,
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
        setModalLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.BOOKING_INFORMATION.GET(id));
            setSelectedBooking(response.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setModalLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, searchTerm, statusFilter]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPageIndex(1);
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setPageIndex(1);
    };

    const handleAccept = async (id) => {
        try {
            await axiosInstance.put(apiEndPoints.BOOKING_INFORMATION.EDIT_STATUS(id, 2));
            fetchData();
        } catch (error) {
            console.error('Failed to accept booking:', error);
        }
    };

    const handleCancel = async (id) => {
        try {
            await axiosInstance.put(apiEndPoints.BOOKING_INFORMATION.EDIT_STATUS(id, 0));
            fetchData();
        } catch (error) {
            console.error('Failed to cancel booking:', error);
        }
    };

    const showDetailModal = (booking) => {
        fetchDataById(booking.id);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedBooking(null);
    };

    const statusColors = {
        0: 'red',
        1: 'blue',
        2: 'green',
    };

    const columns = [
        {
            title: 'User Name',
            dataIndex: 'userFullName',
            key: 'userFullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            responsive: ['lg'],
        },
        {
            title: 'Branch',
            dataIndex: 'branchName',
            key: 'branchName',
            responsive: ['md'],
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            render: (text) => getFormattedTime(text),
        },
        {
            title: 'People',
            dataIndex: 'numberOfPeople',
            key: 'numberOfPeople',
            responsive: ['lg'],
        },
        {
            title: 'Children',
            dataIndex: 'numberOfChildren',
            key: 'numberOfChildren',
            responsive: ['xl'],
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
            render: (status) => (
                <Tag color={statusColors[status] || 'default'}>
                    {status === 0 ? 'Canceled' : status === 1 ? 'Booking' : 'Confirmed'}
                </Tag>
            ),
            responsive: ['sm'],
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space wrap>
                    <Button type="link" onClick={() => showDetailModal(record)}>Detail</Button>
                    {record.bookingStatus === 1 && (
                        <>
                            <Button type="primary" onClick={() => handleAccept(record.id)}>Accept</Button>
                            <Button danger onClick={() => handleCancel(record.id)}>Cancel</Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Content style={{ padding: '20px' }}>
            <Title level={3}>Booking Information</Title>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                <Search
                    placeholder="Search by username, phone number, email"
                    onSearch={handleSearch}
                    style={{ width: '100%' }}
                />
                <Select
                    placeholder="Filter by Status"
                    style={{ width: '100%' }}
                    onChange={handleStatusChange}
                    value={statusFilter}
                    allowClear
                >
                    <Option value={-1}>All</Option>
                    <Option value={0}>Canceled</Option>
                    <Option value={1}>Booking</Option>
                    <Option value={2}>Confirmed</Option>
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
                title="Booking Details"
                open={isModalVisible}
                onCancel={handleModalClose}
                width={windowSize.width < 768 ? '100%' : '70vw'}
                footer={[<Button key="close" onClick={handleModalClose}>Close</Button>]}
            >
                {modalLoading ? (
                    <Spin />
                ) : selectedBooking && (
                    <div>
                        <p><strong>User Name:</strong> {selectedBooking.userFullName}</p>
                        <p><strong>Email:</strong> {selectedBooking.email}</p>
                        <p><strong>Branch:</strong> {selectedBooking.branchName}</p>
                        <p><strong>Time:</strong> {dayjs(selectedBooking.time).format('MM/DD HH:mm')}</p>
                        <p><strong>Number of People:</strong> {selectedBooking.numberOfPeople}</p>
                        {selectedBooking.numberOfChildren && <p><strong>Number of Children:</strong> {selectedBooking.numberOfChildren}</p>}
                        <p><strong>Phone Number:</strong> {selectedBooking.phoneNumber}</p>
                        <p><strong>Status:</strong> {selectedBooking.bookingStatus === 0 ? 'Canceled' : selectedBooking.bookingStatus === 1 ? 'Booking' : 'Confirmed'}</p>
                        {selectedBooking.message && <p><strong>Message:</strong> {selectedBooking.message}</p>}

                        {selectedBooking.preOrderItems && selectedBooking.preOrderItems.length > 0 && (
                            <>
                                <div
                                    style={{
                                        display: windowSize.width < 768 ? 'block' : 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: '20px',
                                    }}
                                >
                                    <Title level={4} style={{ margin: 0, width: windowSize.width < 768 ? '100%' : 'auto' }}>
                                        Pre-Order Items
                                    </Title>
                                    <Title level={5} style={{ margin: 0, width: windowSize.width < 768 ? '100%' : 'auto' }}>
                                        Total: {selectedBooking.preOrderItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} VND
                                    </Title>
                                </div>

                                <Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
                                    {selectedBooking.preOrderItems.map(item => (
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
                            </>
                        )}
                    </div>
                )}
            </Modal>

        </Content>
    );
};
export default BookingManagementAdminPage;