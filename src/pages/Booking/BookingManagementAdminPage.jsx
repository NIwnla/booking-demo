import { Layout, Input, Select, Typography, Tag, Space, Button, Table, Pagination, Modal, Spin, Card, Col, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { useWindowSize } from '../../helpers/useWindowSize';
import axiosInstance from '../../service/axios';
import { AxiosConstants } from '../../constaints/axiosContaint';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const BookingManagementAdminPage = () => {
    const { t } = useTranslation("global");
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
            dataIndex: 'branchName',
            key: 'branchName',
            responsive: ['md'],
        },
        {
            title: t('booking.bookingManagement.columns.time'),
            dataIndex: 'time',
            key: 'time',
            render: (text) => getFormattedTime(text),
        },
        {
            title: t('booking.bookingManagement.columns.numberOfPeople'),
            dataIndex: 'numberOfPeople',
            key: 'numberOfPeople',
            responsive: ['lg'],
        },
        {
            title: t('booking.bookingManagement.columns.numberOfChildren'),
            dataIndex: 'numberOfChildren',
            key: 'numberOfChildren',
            responsive: ['xl'],
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
        <Content style={{ padding: '20px' }}>
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

            <Modal
                title={t('booking.bookingManagement.titles.modalTitle')}
                open={isModalVisible}
                onCancel={handleModalClose}
                width={windowSize.width < 768 ? '100%' : '70vw'}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        {t('booking.bookingManagement.buttons.close')}
                    </Button>,
                ]}
            >
                {modalLoading ? (
                    <Spin />
                ) : selectedBooking && (
                        <div>
                            <p>
                                <strong>{t('booking.bookingManagement.modal.fields.userFullName')}:</strong> {selectedBooking.userFullName}
                            </p>
                            <p>
                                <strong>{t('booking.bookingManagement.modal.fields.email')}:</strong> {selectedBooking.email}
                            </p>
                            <p>
                                <strong>{t('booking.bookingManagement.modal.fields.branchName')}:</strong> {selectedBooking.branchName}
                            </p>
                            <p>
                                <strong>{t('booking.bookingManagement.modal.fields.time')}:</strong> {dayjs(selectedBooking.time).format('MM/DD HH:mm')}
                            </p>
                            <p>
                                <strong>{t('booking.bookingManagement.modal.fields.numberOfPeople')}:</strong> {selectedBooking.numberOfPeople}
                            </p>
                            {selectedBooking.numberOfChildren && (
                                <p>
                                    <strong>{t('booking.bookingManagement.modal.fields.numberOfChildren')}:</strong> {selectedBooking.numberOfChildren}
                                </p>
                            )}
                            <p>
                                <strong>{t('booking.bookingManagement.modal.fields.phoneNumber')}:</strong> {selectedBooking.phoneNumber}
                            </p>
                            <p>
                                <strong>{t('booking.bookingManagement.modal.fields.status')}: </strong>
                                {selectedBooking.bookingStatus === 0
                                    ? t('booking.bookingManagement.statuses.cancelled')
                                    : selectedBooking.bookingStatus === 1
                                        ? t('booking.bookingManagement.statuses.pending')
                                        : t('booking.bookingManagement.statuses.confirmed')}
                            </p>
                            {selectedBooking.message && (
                                <p>
                                    <strong>{t('booking.bookingManagement.modal.fields.message')}:</strong> {selectedBooking.message}
                                </p>
                            )}
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
                                            {t('booking.bookingManagement.titles.preOrderItems')}
                                        </Title>
                                        <Title level={5} style={{ margin: 0, width: windowSize.width < 768 ? '100%' : 'auto' }}>
                                            {t('booking.bookingManagement.titles.total')}:{' '}
                                            {selectedBooking.preOrderItems
                                                .reduce((total, item) => total + item.price * item.quantity, 0)
                                                .toLocaleString()}{' '}
                                            VND
                                        </Title>
                                    </div>

                                    <Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
                                        {selectedBooking.preOrderItems.map((item) => (
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
                                                                <p>
                                                                    {t('booking.bookingManagement.modal.preOrderItems.price')}: {item.price.toLocaleString()} VND
                                                                </p>
                                                                <p>
                                                                    {t('booking.bookingManagement.modal.preOrderItems.quantity')}: {item.quantity}
                                                                </p>
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
