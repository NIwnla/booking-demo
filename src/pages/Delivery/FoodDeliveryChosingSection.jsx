import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import {
    App,
    Button,
    Card,
    Col,
    Collapse,
    Empty,
    Image,
    Input,
    List,
    Pagination,
    Row,
    Space,
    Spin,
    Tooltip,
    Typography
} from 'antd';
import React, { useEffect, useState } from 'react';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import axiosInstance from '../../service/axios';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';


const FoodDeliveryChosingSection = ({ onPreorder, onFinish }) => {
    const { userId } = useContext(AuthContext);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState('');
    const [preorders, setPreorders] = useState({});
    const [havePendingDelivery, setHavePendingDelivery] = useState(false);
    const { message } = App.useApp();

    useEffect(() => {
        const checkPendingDelivery = async () => {
            try {
                const response = await axiosInstance.get(apiEndPoints.DELIVERY_INFORMATION.CHECK_PENDING(userId));
                setHavePendingDelivery(response.data);
            } catch (error) {
                console.error('Failed to check pending delivery:', error);
            }
        }

        checkPendingDelivery();
    });

    useEffect(() => {
        fetchFoods();
    }, [pageIndex, pageSize, search]);

    useEffect(() => {
        onPreorder(preorders);
    }, [preorders]);

    const fetchFoods = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.FOOD.GET_ALL, {
                params: { pageIndex, pageSize, search },
            });
            setFoods(response.data.items);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            message.error('Failed to fetch foods.');
        } finally {
            setLoading(false);
        }
    };

    const handleIncrement = (itemId) => {
        setPreorders((prevPreorders) => ({
            ...prevPreorders,
            [itemId]: {
                ...(prevPreorders[itemId] || { quantity: 0 }),
                quantity: (prevPreorders[itemId]?.quantity || 0) + 1,
            },
        }));
    };

    const handleDecrement = (itemId) => {
        setPreorders((prevPreorders) => ({
            ...prevPreorders,
            [itemId]: {
                ...(prevPreorders[itemId] || { quantity: 0 }),
                quantity: Math.max((prevPreorders[itemId]?.quantity || 0) - 1, 0),
            },
        }));
    };

    return (
        <div
            style={{
                backgroundColor: '#f0f0f0',
                padding: '24px',
                borderRadius: '8px',
                marginTop: '24px',
            }}
        >
            <Row gutter={[16, 16]}>
                {/* Left Section: Available Foods */}
                <Col xs={24} sm={24} lg={18}>
                    <Typography.Title
                        level={4}
                        style={{
                            textAlign: 'center',
                            marginBottom: '24px',
                            backgroundColor: '#fff',
                            padding: '12px',
                            borderRadius: '8px',
                        }}
                    >
                        Chọn món để giao hàng
                    </Typography.Title>
                    <Input.Search
                        placeholder="Search food"
                        onSearch={(value) => setSearch(value)}
                        style={{
                            marginBottom: 24,
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                        }}
                    />
                    <Spin spinning={loading}>
                        <Row gutter={[16, 16]}>
                            {foods.map((food) => (
                                <Col key={food.id} xs={24} sm={12} md={8} lg={8} xl={8}>
                                    <Card
                                        hoverable
                                        style={{
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            transition: 'transform 0.3s ease',
                                        }}
                                        styles={{ body: { backgroundColor: '#fff' } }}
                                        cover={
                                            <div
                                                style={{
                                                    overflow: 'hidden',
                                                    height: '20vh',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Image
                                                    preview={false}
                                                    alt={food.name}
                                                    src={`${axiosInstance.defaults.baseURL}/${food.imagePath}`}
                                                />
                                            </div>
                                        }
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    >
                                        <Card.Meta
                                            title={food.name}
                                            description={
                                                food.description || 'No description available'
                                            }
                                        />
                                        <Typography
                                            style={{
                                                marginTop: '2vh',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                        </Typography>
                                        <div style={{ marginTop: 16 }}>
                                            <div
                                                style={{
                                                    marginBottom: 16,
                                                    display: 'flex',
                                                    justifyContent: 'space-between',

                                                }}
                                            >
                                                <strong><ShoppingCartOutlined />{food.basePrice}đ</strong>
                                                <Button
                                                    type='primary'
                                                    onClick={() => handleIncrement(food.id)}
                                                >
                                                    <PlusOutlined />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Spin>
                    <Pagination
                        current={pageIndex}
                        pageSize={pageSize}
                        total={totalCount}
                        onChange={(page, pageSize) => {
                            setPageIndex(page);
                            setPageSize(pageSize);
                        }}
                        style={{ marginTop: 24, textAlign: 'center' }}
                    />
                </Col>
                {/* Right Section: Preordered List */}
                <Col xs={24} sm={24} lg={6}>
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '16px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px',
                            }}
                        >
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                Giỏ Hàng
                            </Typography.Title>
                            <Button
                                type="text"
                                danger
                                onClick={() => setPreorders({})}
                                style={{
                                    padding: '0 8px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Clear All
                            </Button>
                        </div>
                        <List
                            dataSource={Object.keys(preorders).filter(
                                (key) => preorders[key]?.quantity > 0
                            )}
                            renderItem={(key) => {
                                const food = foods.find((item) => item.id === key) || {};
                                const quantity = preorders[key]?.quantity || 0;
                                return (
                                    <List.Item>
                                        <div style={{ display: 'flex', width: '100%' }}>
                                            <Image
                                                preview={false}
                                                width={100}
                                                src={`${axiosInstance.defaults.baseURL}/${food.imagePath}`}
                                                alt={food.name}
                                            />
                                            <div
                                                style={{
                                                    marginLeft: '16px',
                                                    flex: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <Typography.Text
                                                    style={{
                                                        fontSize: '16px',
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {food.name}
                                                </Typography.Text>
                                                <div style={{ marginTop: '8px' }}>
                                                    <Typography.Text
                                                        strong
                                                        style={{
                                                            fontSize: '14px',
                                                            color: '#555',
                                                        }}
                                                    >
                                                        Giá: {food.basePrice}đ
                                                    </Typography.Text>
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: 'auto',
                                                        display: 'flex',
                                                        justifyContent: 'flex-start',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Space>
                                                        <Typography.Text strong>Số Lượng:</Typography.Text>
                                                        <Button
                                                            size="small"
                                                            onClick={() => handleDecrement(food.id)}
                                                        >
                                                            -
                                                        </Button>
                                                        <Typography.Text>{quantity}</Typography.Text>
                                                        <Button
                                                            size="small"
                                                            onClick={() => handleIncrement(food.id)}
                                                        >
                                                            +
                                                        </Button>
                                                    </Space>
                                                </div>
                                            </div>
                                        </div>
                                    </List.Item>
                                );
                            }}
                            locale={{
                                emptyText: (
                                    <Empty
                                        description={
                                            <Typography.Text type="secondary">
                                                Giỏ hàng trống, hãy thêm món ăn để đặt trước!
                                            </Typography.Text>
                                        }
                                    />
                                ),
                            }}
                        />
                        {Object.keys(preorders).length > 0 && (
                            <>
                                <div
                                    style={{
                                        marginTop: 'auto',
                                        borderTop: '1px solid #d9d9d9',
                                        paddingTop: '16px',
                                    }}
                                >
                                    <Typography.Text strong style={{ fontSize: '16px' }}>
                                        Tổng Giá:{" "}
                                        {Object.keys(preorders)
                                            .reduce((total, key) => {
                                                const food = foods.find((item) => item.id === key) || {};
                                                const quantity = preorders[key]?.quantity || 0;
                                                return total + quantity * (food.basePrice || 0);
                                            }, 0)
                                            .toLocaleString()}đ
                                    </Typography.Text>
                                </div>
                                <div
                                    style={{
                                        marginTop: '16px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Tooltip title={havePendingDelivery ? 'Quý khách hiện đang có đơn hàng khác, xin vui lòng xác nhận là đơn hàng trước được nhận trước khi tạo thêm đơn hàng mới' : ''}>
                                        <Button
                                            type="primary"
                                            size="large"
                                            onClick={onFinish}
                                            disabled={havePendingDelivery}
                                            style={{
                                                width: '100%',
                                                borderRadius: '8px',
                                            }}
                                        >
                                            Hoàn Thành
                                        </Button>
                                    </Tooltip>
                                </div>
                            </>
                        )}

                    </div>
                </Col>

            </Row>
        </div>
    );
};

export default FoodDeliveryChosingSection;
