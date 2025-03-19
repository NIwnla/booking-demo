import { App, Button, Layout, Pagination, Select, Space, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { useWindowSize } from '../../helpers/useWindowSize';
import axiosInstance from '../../service/axios';
import DeliveryDetailsModal from './components/DeliveryDetailsModal';

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
            ellipsis: true,
        },
        {
            title: t('delivery.management.columns.phoneNumber'),
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            responsive: ['sm'],
        },
        {
            title: t('delivery.management.columns.location'),
            dataIndex: 'location',
            key: 'location',
            ellipsis: true,
            responsive: ['md'],
        },
        {
            title: t('delivery.management.columns.total'),
            dataIndex: 'total',
            key: 'total',
            responsive: ['sm'],
            render: (total) => `${total.toLocaleString()} VND`,
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
        <Content style={{ padding: '5vh 10vw' }}>
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

            <DeliveryDetailsModal
                isOpen={isModalVisible}
                onClose={handleModalClose}
                loading={loading}
                delivery={selectedDelivery}
                windowSize={windowSize}
            />
        </Content>
    );
};

export default DeliveryManagementPageAdmin;
