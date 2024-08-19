import React, { useEffect, useState } from 'react';
import { Table, Input, Select, Pagination, Layout, Typography } from 'antd';
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
    const [statusFilter, setStatusFilter] = useState(null);

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

    const columns = [
        {
            title: 'User Name',
            dataIndex: 'userFullName',
            key: 'userFullName',
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
                switch (status) {
                    case 0:
                        return 'Canceled';
                    case 1:
                        return 'Booking';
                    case 2:
                        return 'Confirmed';
                    default:
                        return 'Unknown';
                }
            },
        },
    ];

    return (
        <Content style={{ padding: '20px', marginTop: '20px' }}>
            <Title level={3}>Booking Information</Title>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <Search
                    placeholder="Search by user name or phone number"
                    onSearch={handleSearch}
                    style={{ width: '300px' }}
                />
                <Select
                    placeholder="Filter by Status"
                    style={{ width: '200px' }}
                    onChange={handleStatusChange}
                    allowClear
                >
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
        </Content>
    );
};

export default BookingManagementAdminPage;
