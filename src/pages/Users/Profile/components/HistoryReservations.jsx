import { Typography, Tag, Spin, Empty, Space, Card, Pagination, Table } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { AuthContext } from "../../../../context/AuthContext";
import axiosInstance from "../../../../service/axios";
import { apiEndPoints } from "../../../../constaints/apiEndPoint";


const { Text } = Typography;

const HistoryReservations = () => {
    const { t } = useTranslation('global');
    const { userId } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const isMobile = useMediaQuery({ maxWidth: 768 });

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axiosInstance.get(apiEndPoints.BOOKING_INFORMATION.GET_HISTORY_BOOKING, {
                    params: {
                        pageIndex: currentPage,
                        pageSize: pageSize
                    }
                });
                setReservations(response.data.items);
                setTotalItems(response.data.total);
            } catch (error) {
                console.error('Error fetching reservation history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [userId, currentPage]);

    const columns = [
        {
            title: t('profile.reservations.date'),
            dataIndex: 'time',
            key: 'time',
            render: (time) => dayjs(time).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: t('profile.reservations.branch'),
            dataIndex: 'branchNameVN',
            key: 'branch',
            responsive: ['md'],
        },
        {
            title: t('profile.reservations.guests'),
            key: 'guests',
            render: (_, record) => record.adult + record.peopleOver60 + record.peopleUnder6,
        },
        {
            title: t('profile.reservations.status.title'),
            dataIndex: 'bookingStatus',
            key: 'status',
            render: (status) => {
                const statusMap = {
                    0: { color: 'red', text: t('profile.reservations.status.cancelled') },
                    3: { color: 'green', text: t('profile.reservations.status.completed') },
                };
                return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
            },
        },
    ];

    if (loading) return <Spin />;
    if (!reservations.length) return <Empty description={t('profile.reservations.noHistory')} />;

    const renderMobileView = () => (
        <Space direction="vertical" style={{ width: '100%' }}>
            {reservations.map((reservation) => (
                <Card key={reservation.id} size="small">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong>{dayjs(reservation.time).format('DD/MM/YYYY HH:mm')}</Text>
                            {(() => {
                                const statusMap = {
                                    0: { color: 'red', text: t('profile.reservations.status.cancelled') },
                                    3: { color: 'green', text: t('profile.reservations.status.completed') },
                                };
                                return <Tag color={statusMap[reservation.bookingStatus].color}>
                                    {statusMap[reservation.bookingStatus].text}
                                </Tag>;
                            })()}
                        </div>
                        <Text>{t('profile.reservations.branch')}: {reservation.branchNameVN}</Text>
                        <Text>{t('profile.reservations.guests')}: {
                            reservation.adult + reservation.peopleOver60 + reservation.peopleUnder6
                        }</Text>
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

    return isMobile ? renderMobileView() : (
        <Table
            dataSource={reservations}
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

export default HistoryReservations;