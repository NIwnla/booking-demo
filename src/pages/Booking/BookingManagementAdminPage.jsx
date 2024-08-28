import React, { useEffect, useState } from 'react';
import { Table, Input, Select, Pagination, Layout, Typography, Button, Modal, Tag } from 'antd';
import { apiEndPoints } from '../../constaints/apiEndPoint';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.BOOKING_INFORMATION.GET_ALL, {
                params: {
                    pageIndex,
                    pageSize,
                    search: searchTerm,
                    statusFilter,
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

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, searchTerm, statusFilter]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPageIndex(1); // Reset to first page when searching
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        setPageIndex(1); // Reset to first page when filtering
    };

    const handleAccept = async (id) => {
        try {
            await axiosInstance.put(apiEndPoints.BOOKING_INFORMATION.EDIT(id, 2));
            fetchData();
        } catch (error) {
            console.error('Failed to accept booking:', error);
        }
    };

    const handleCancel = async (id) => {
        try {
            await axiosInstance.put(apiEndPoints.BOOKING_INFORMATION.EDIT(id, 0));
            fetchData();
        } catch (error) {
            console.error('Failed to cancel booking:', error);
        }
    };

    const showDetailModal = (booking) => {
        setSelectedBooking(booking);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedBooking(null);
    };

    const statusColors = {
        0: 'red',     // Canceled
        1: 'blue',    // Booking
        2: 'green',   // Confirmed
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
        },
        {
            title: 'Branch',
            dataIndex: 'branchName',
            key: 'branchName',
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Number of People',
            dataIndex: 'numberOfPeople',
            key: 'numberOfPeople',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Booking Status',
            dataIndex: 'bookingStatus',
            key: 'bookingStatus',
            render: (status) => {
                let color = statusColors[status] || 'default';
                let text = '';

                switch (status) {
                    case 0:
                        text = 'Canceled';
                        break;
                    case 1:
                        text = 'Booking';
                        break;
                    case 2:
                        text = 'Confirmed';
                        break;
                    default:
                        text = 'Unknown';
                }

                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Button type="link" onClick={() => showDetailModal(record)}>Detail</Button>
                    {record.bookingStatus === 1 && (
                        <>
                            <Button type="primary" onClick={() => handleAccept(record.id)} style={{ marginRight: 8 }}>Accept</Button>
                            <Button danger onClick={() => handleCancel(record.id)}>Cancel</Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Content style={{ padding: '20px' }}>
            <Title level={3}>Booking Information</Title>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <Search
                    placeholder="Search by username, phone number, email"
                    onSearch={handleSearch}
                    style={{ width: '350px' }}
                />
                <Select
                    placeholder="Filter by Status"
                    style={{ width: '200px' }}
                    onChange={handleStatusChange}
                    value={statusFilter}
                    allowClear
                >
                    <Option value={null}>All</Option>
                    <Option value={0}>Canceled</Option>
                    <Option value={1}>Booking</Option>
                    <Option value={2}>Confirmed</Option>
                </Select>
            </div>
            <Table
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
                style={{ marginTop: '20px', textAlign: 'center' }}
            />

            <Modal
                title="Booking Details"
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Close
                    </Button>,
                ]}
            >
                {selectedBooking && (
                    <div>
                        <p><strong>User Name:</strong> {selectedBooking.userFullName}</p>
                        <p><strong>Email:</strong> {selectedBooking.email}</p>
                        <p><strong>Branch:</strong> {selectedBooking.branchName}</p>
                        <p><strong>Time:</strong> {new Date(selectedBooking.time).toLocaleString()}</p>
                        <p><strong>Number of People:</strong> {selectedBooking.numberOfPeople}</p>
                        <p><strong>Phone Number:</strong> {selectedBooking.phoneNumber}</p>
                        <p><strong>Status:</strong> {selectedBooking.bookingStatus === 0 ? 'Canceled' : selectedBooking.bookingStatus === 1 ? 'Booking' : 'Confirmed'}</p>
                        <p><strong>Message:</strong> {selectedBooking.message}</p>
                    </div>
                )}
            </Modal>
        </Content>
    );
};

export default BookingManagementAdminPage;
