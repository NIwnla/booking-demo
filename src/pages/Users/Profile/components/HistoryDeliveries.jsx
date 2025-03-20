import { Empty, Spin, Table, Tag, Card, Typography, Space, Pagination } from "antd";
import { useMediaQuery } from 'react-responsive';
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiEndPoints } from "../../../../constaints/apiEndPoint";
import { AuthContext } from "../../../../context/AuthContext";
import axiosInstance from "../../../../service/axios";

const { Text } = Typography;

const HistoryDeliveries = () => {
    const { t } = useTranslation('global');
    const { userId } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [deliveries, setDeliveries] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const isMobile = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {                
                const response = await axiosInstance.get(apiEndPoints.DELIVERY_INFORMATION.GET_HISTORY, {
                    params: {
                        pageIndex: currentPage,
                        pageSize: pageSize
                    }
                });
                setDeliveries(response.data.items);
                setTotalItems(response.data.total);
            } catch (error) {
                console.error('Error fetching delivery history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveries();
    }, [userId, currentPage]);

    const columns = [
        {
            title: t('profile.deliveries.orderTime'),
            dataIndex: 'time',
            key: 'time',
            render: (time) => dayjs(time).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: t('profile.deliveries.location'),
            dataIndex: 'location',
            key: 'location',
            ellipsis: true,
            responsive: ['md'],
        },
        {
            title: t('profile.deliveries.total'),
            dataIndex: 'total',
            key: 'total',
            render: (total) => `${total.toLocaleString()} VND`,
        },
        {
            title: t('profile.deliveries.status.title'),
            dataIndex: 'deliveryStatus',
            key: 'deliveryStatus',
            render: (status) => {
                const statusMap = {
                    0: { color: 'red', text: t('delivery.management.statuses.cancelled') },
                    3: { color: 'green', text: t('delivery.management.statuses.completed') },
                };
                return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
            },
        },
    ];

    const renderMobileView = () => (
        <Space direction="vertical" style={{ width: '100%' }}>
            {deliveries.map((delivery) => (
                <Card key={delivery.id} size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong>{dayjs(delivery.time).format('DD/MM/YYYY HH:mm')}</Text>
                            {(() => {
                                const statusMap = {
                                    0: { color: 'red', text: t('delivery.management.statuses.cancelled') },
                                    3: { color: 'green', text: t('delivery.management.statuses.completed') },
                                };
                                return <Tag color={statusMap[delivery.deliveryStatus].color}>
                                    {statusMap[delivery.deliveryStatus].text}
                                </Tag>;
                            })()}
                        </div>
                        <Text>{t('profile.deliveries.total')}: {delivery.total.toLocaleString()} VND</Text>
                        <Text type="secondary" ellipsis>{delivery.location}</Text>
                    </Space>
                </Card>
            ))}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalItems}
                    onChange={(page) => setCurrentPage(page)}
                    size="small"
                    simple
                />
            </div>
        </Space>
    );

    if (loading) return <Spin />;
    if (!deliveries.length) return <Empty description={t('profile.deliveries.noHistory')} />;

    return isMobile ? renderMobileView() : (
        <Table
            dataSource={deliveries}
            // @ts-ignore
            columns={columns}
            rowKey="id"
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalItems,
                onChange: (page) => setCurrentPage(page),
                showSizeChanger: false,
            }}
        />
    );
};

export default HistoryDeliveries;