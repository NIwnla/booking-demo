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
            console.error('Không thể tải dữ liệu:', error);
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
            console.error('Không thể tải dữ liệu:', error);
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
            message.success('Xóa thông tin giao hàng thành công!');
            fetchData();
        } catch (error) {
            console.error('Lỗi khi xóa thông tin giao hàng:', error);
            message.error('Có lỗi xảy ra khi xóa thông tin giao hàng.');
        }
    };

    const handleUpdate = async (id, status) => {
        try {
            const response = await axiosInstance.put(apiEndPoints.DELIVERY_INFORMATION.EDIT_STATUS(id, status));
            message.success('Cập nhật thông tin giao hàng thành công!');
            fetchData();
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin giao hàng:', error);
            message.error('Có lỗi xảy ra khi cập nhật thông tin giao hàng.');
        }
    };

    const columns = [
        {
            title: 'Tên Người Dùng',
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
            title: 'Thời Gian',
            dataIndex: 'time',
            key: 'time',
            responsive: ['md'],
            ellipsis: true,
            render: (time) => {
                const formattedTime = dayjs(time).utc().local().format('DD/MM HH:mm');
                return formattedTime;
            },
        },
        {
            title: 'Địa Chỉ',
            dataIndex: 'location',
            key: 'location',
            responsive: ['md'],
            ellipsis: true,
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            responsive: ['lg'],
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            responsive: ['sm'],
            render: (status) => {
                let color;
                let message;
                switch (status) {
                    case 0:
                        color = 'red';
                        message = 'Hủy';
                        break;
                    case 1:
                        color = 'orange';
                        message = 'Đang Đợi';
                        break;
                    case 2:
                        color = 'blue';
                        message = 'Đang giao';
                        break;
                    case 3:
                        color = 'green';
                        message = 'Đã giao';
                        break;
                    default:
                        color = 'gray';
                        message = 'Không xác định';
                }
                return <Tag color={color}>{message}</Tag>;
            },
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (text, record) => (
                <Space wrap>
                    <Button type="link" onClick={() => showDetailModal(record)}>Chi Tiết</Button>
                    {record.status === 'Đợi' && (
                        <Button
                            type="link"
                            onClick={() => handleUpdate(record.id, 2)}
                        >
                            Phân Công
                        </Button>
                    )}
                    {record.status !== 'Đã giao' && (
                        <Button
                            type="link"
                            onClick={() => handleUpdate(record.id, 0)}
                            danger
                        >
                            Hủy
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Content style={{ padding: '20px' }}>
            <Title level={3}>Quản Lý Giao Hàng</Title>
            <div style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                marginBottom: '20px',
            }}>
                <Select
                    placeholder="Lọc theo Trạng Thái"
                    style={{ width: '100%' }}
                    onChange={handleStatusChange}
                    value={statusFilter}
                    allowClear
                >
                    <Option value={undefined}>Tất Cả</Option>
                    <Option value={0}>Hủy</Option>
                    <Option value={1}>Đang Đợi</Option>
                    <Option value={2}>Đang giao</Option>
                    <Option value={3}>Đã giao</Option>
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
                title="Chi Tiết Giao Hàng"
                open={isModalVisible}
                onCancel={handleModalClose}
                width={windowSize.width < 768 ? '100%' : '70vw'}
                footer={[<Button key="close" onClick={handleModalClose}>Đóng</Button>]}>
                {loading ? (
                    <Spin />
                ) : selectedDelivery && (
                    <div>
                        <p><strong>Tên Người Dùng:</strong> {selectedDelivery.userFullName}</p>
                        <p><strong>Email:</strong> {selectedDelivery.username}</p>
                        <p><strong>Thời Gian:</strong> {dayjs(selectedDelivery.time).format('DD/MM HH:mm')}</p>
                        <p><strong>Địa Chỉ:</strong> {selectedDelivery.location}</p>
                        <p><strong>Số Điện Thoại:</strong> {selectedDelivery.phoneNumber}</p>
                        <p><strong>Trạng Thái:</strong> {selectedDelivery.status}</p>
                        {selectedDelivery.message && <p><strong>Lời Nhắn:</strong> {selectedDelivery.message}</p>}

                        <div
                            style={{
                                display: windowSize.width < 768 ? 'block' : 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '20px',
                            }}
                        >
                            <Title level={4} style={{ margin: 0, width: windowSize.width < 768 ? '100%' : 'auto' }}>
                                Danh Sách Món:
                            </Title>
                            <Title level={5} style={{ margin: 0, width: windowSize.width < 768 ? '100%' : 'auto' }}>
                                Tổng: {selectedDelivery.preOrderItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} VND
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
                                                    <p>Số Lượng: {item.quantity}</p>
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
