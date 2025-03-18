import { Button, Input, Layout, Pagination, Select, Space, Table, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { getLocalizedText } from '../../helpers/getLocalizedText';
import { useWindowSize } from '../../helpers/useWindowSize';
import axiosInstance from '../../service/axios';
import BookingDetailsModal from './components/BookingDetailsModal';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const BookingManagementAdminPage = () => {
    const { t ,i18n} = useTranslation("global");
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
        const date = dayjs(time).add(7, 'hours');
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
            console.error(t('booking.bookingManagement.messages.fetchError'), error);
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
            console.error(t('booking.bookingManagement.messages.fetchError'), error);
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
            console.error(t('booking.bookingManagement.messages.acceptError'), error);
        }
    };

    const handleCancel = async (id) => {
        try {
            await axiosInstance.put(apiEndPoints.BOOKING_INFORMATION.EDIT_STATUS(id, 0));
            fetchData();
        } catch (error) {
            console.error(t('booking.bookingManagement.messages.cancelError'), error);
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
            title: t('booking.bookingManagement.columns.userFullName'),
            dataIndex: 'userFullName',
            key: 'userFullName',
        },
        {
            title: t('booking.bookingManagement.columns.email'),
            dataIndex: 'email',
            key: 'email',
            responsive: ['lg'],
        },
        {
            title: t('booking.bookingManagement.columns.branchName'),
            dataIndex: 'branchNameVN',
            key: 'branchName',
            responsive: ['md'],
            render:(_, record) => getLocalizedText(record, 'branchName', i18n.language)
        },
        {
            title: t('booking.bookingManagement.columns.time'),
            dataIndex: 'time',
            key: 'time',
            render: (text) => getFormattedTime(text),
        },
        {
            title: t('booking.bookingManagement.columns.numberOfPeople'),
            dataIndex: 'adult',
            key: 'adult',
            responsive: ['lg'],
        },
        {
            title: t('booking.bookingManagement.columns.phoneNumber'),
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            responsive: ['lg'],
        },
        {
            title: t('booking.bookingManagement.columns.status'),
            dataIndex: 'bookingStatus',
            key: 'bookingStatus',
            render: (status) => (
                <Tag color={statusColors[status] || 'default'}>
                    {status === 0
                        ? t('booking.bookingManagement.statuses.cancelled')
                        : status === 1
                            ? t('booking.bookingManagement.statuses.pending')
                            : t('booking.bookingManagement.statuses.confirmed')}
                </Tag>
            ),
            responsive: ['sm'],
        },
        {
            title: t('booking.bookingManagement.columns.action'),
            key: 'action',
            render: (text, record) => (
                <Space wrap>
                    <Button type="link" onClick={() => showDetailModal(record)}>
                        {t('booking.bookingManagement.buttons.detail')}
                    </Button>
                    {record.bookingStatus === 1 && (
                        <>
                            <Button type="primary" onClick={() => handleAccept(record.id)}>
                                {t('booking.bookingManagement.buttons.accept')}
                            </Button>
                            <Button danger onClick={() => handleCancel(record.id)}>
                                {t('booking.bookingManagement.buttons.cancel')}
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Content style={{ padding: '2rem 10vw' }}>
            <Title level={3}>{t('booking.bookingManagement.titles.pageTitle')}</Title>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                <Search
                    placeholder={t('booking.bookingManagement.placeholders.search')}
                    onSearch={handleSearch}
                    style={{ width: '100%' }}
                />
                <Select
                    placeholder={t('booking.bookingManagement.placeholders.statusFilter')}
                    style={{ width: '100%' }}
                    onChange={handleStatusChange}
                    value={statusFilter}
                    allowClear
                >
                    <Option value={-1}>{t('booking.bookingManagement.statuses.all')}</Option>
                    <Option value={0}>{t('booking.bookingManagement.statuses.cancelled')}</Option>
                    <Option value={1}>{t('booking.bookingManagement.statuses.pending')}</Option>
                    <Option value={2}>{t('booking.bookingManagement.statuses.confirmed')}</Option>
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

        
            <BookingDetailsModal
                isVisible={isModalVisible}
                onClose={handleModalClose}
                loading={modalLoading}
                booking={selectedBooking}
                windowSize={windowSize}
            />
        </Content>
    );
};

export default BookingManagementAdminPage;
