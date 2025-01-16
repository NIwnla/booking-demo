import { App, Button, Card, Col, Layout, Modal, Pagination, Row, Select, Space, Spin, Table, Tag, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import axiosInstance from '../../service/axios';
import dayjs from 'dayjs';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { useWindowSize } from '../../helpers/useWindowSize';
import { useTranslation } from 'react-i18next';

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

    const { t } = useTranslation("global");

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
            message.error(t('delivery.management.messages.fetchError'), error);
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
            message.error(t('delivery.management.messages.fetchError'));
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
            message.success(t('delivery.management.messages.deleteSuccess'));
            fetchData();
        } catch (error) {
            message.error(t('delivery.management.messages.deleteError'));
        }
    };

    const handleUpdate = async (id, status) => {
        try {
            const response = await axiosInstance.put(apiEndPoints.DELIVERY_INFORMATION.EDIT_STATUS(id, status));
            message.success(t('delivery.management.messages.updateSuccess'));
            fetchData();
        } catch (error) {
            message.error(t('delivery.management.messages.updateError'));
        }
    };

    const columns = [
        {
            title: t('delivery.management.columns.userFullName'),
            dataIndex: 'userFullName',
            key: 'userFullName',
        },
        {
            title: t('delivery.management.columns.email'),
            dataIndex: 'username',
            key: 'username',
            responsive: ['lg'],
            ellipsis: true,
        },
        {
            title: t('delivery.management.columns.time'),
            dataIndex: 'time',
            key: 'time',
            responsive: ['md'],
            ellipsis: true,
            render: (time) => time ? dayjs(time).utc().local().format('DD/MM HH:mm') : '',
        },
        {
            title: t('delivery.management.columns.location'),
            dataIndex: 'location',
            key: 'location',
            responsive: ['md'],
            ellipsis: true,
        },
        {
            title: t('delivery.management.columns.phoneNumber'),
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            responsive: ['lg'],
        },
        {
            title: t('delivery.management.columns.status'),
            dataIndex: 'status',
            key: 'status',
            responsive: ['sm'],
            render: (status) => {
                const statusMap = {
                    0: { color: 'red', message: t('delivery.management.statuses.cancelled') },
                    1: { color: 'orange', message: t('delivery.management.statuses.waiting') },
                    2: { color: 'blue', message: t('delivery.management.statuses.inProgress') },
                    3: { color: 'green', message: t('delivery.management.statuses.completed') },
                    default: { color: 'gray', message: t('delivery.management.statuses.unknown') },
                };
                const { color, message } = statusMap[status] || statusMap.default;
                return <Tag color={color}>{message}</Tag>;
            },
        },
        {
            title: t('delivery.management.columns.action'),
            key: 'action',
            render: (text, record) => (
                <Space wrap>
                    <Button type="link" onClick={() => showDetailModal(record)}>{t('delivery.management.actions.details')}</Button>
                    {record.status === 1 && (
                        <Button type="link" onClick={() => handleUpdate(record.id, 2)}>
                            {t('delivery.management.actions.assign')}
                        </Button>
                    )}
                    {record.status !== 3 && (
                        <Button type="link" onClick={() => handleUpdate(record.id, 0)} danger>
                            {t('delivery.management.actions.cancel')}
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Content style={{ padding: '20px' }}>
            <Title level={3}>{t('delivery.management.title')}</Title>
            <div style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                marginBottom: '20px',
            }}>
                <Select
                    placeholder={t('delivery.management.filterPlaceholder')}
                    style={{ width: '100%' }}
                    onChange={handleStatusChange}
                    value={statusFilter}
                    allowClear
                >
                    <Option value={undefined}>{t('delivery.management.statuses.all')}</Option>
                    <Option value={0}>{t('delivery.management.statuses.cancelled')}</Option>
                    <Option value={1}>{t('delivery.management.statuses.waiting')}</Option>
                    <Option value={2}>{t('delivery.management.statuses.inProgress')}</Option>
                    <Option value={3}>{t('delivery.management.statuses.completed')}</Option>
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
                title={t('delivery.management.modal.title')}
                open={isModalVisible}
                onCancel={handleModalClose}
                width={windowSize.width < 768 ? '100%' : '70vw'}
                footer={[<Button key="close" onClick={handleModalClose}>{t('delivery.management.actions.close')}</Button>]}>
                {loading ? (
                    <Spin />
                ) : selectedDelivery && (
                    <div>
                        <p><strong>{t('delivery.management.modal.userFullName')}:</strong> {selectedDelivery.userFullName}</p>
                        <p><strong>{t('delivery.management.modal.email')}:</strong> {selectedDelivery.username}</p>
                        <p><strong>{t('delivery.management.modal.time')}:</strong> {selectedDelivery.time ? dayjs(selectedDelivery.time).utc().local().format('DD/MM HH:mm') : ''}</p>
                        <p><strong>{t('delivery.management.modal.location')}:</strong> {selectedDelivery.location}</p>
                        <p><strong>{t('delivery.management.modal.phoneNumber')}:</strong> {selectedDelivery.phoneNumber}</p>
                        <p><strong>{t('delivery.management.modal.status')}:</strong> {selectedDelivery.status}</p>
                        {selectedDelivery.message && <p><strong>{t('delivery.management.modal.message')}:</strong> {selectedDelivery.message}</p>}

                        <div
                            style={{
                                display: windowSize.width < 768 ? 'block' : 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '20px',
                            }}
                        >
                            <Title level={4} style={{ margin: 0, width: windowSize.width < 768 ? '100%' : 'auto' }}>
                                {t('delivery.management.modal.preOrderItems')}:
                            </Title>
                            <Title level={5} style={{ margin: 0, width: windowSize.width < 768 ? '100%' : 'auto' }}>
                                {t('delivery.management.modal.total')} {selectedDelivery.preOrderItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} VND
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
                                                    <p>{t('delivery.management.modal.quantity')}: {item.quantity}</p>
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
