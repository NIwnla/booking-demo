import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import {
    App,
    Button,
    Card,
    Checkbox,
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


const FoodPreorderSection = ({ onPreorder, onFinish, isFormValid }) => {
    const { userId } = useContext(AuthContext);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState('');
    const [preorders, setPreorders] = useState({});
    const [havePendingBooking, setHavePendingBooking] = useState(false);
    const { message } = App.useApp();
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        const checkPendingDelivery = async () => {
            try {
                const response = await axiosInstance.get(apiEndPoints.BOOKING_INFORMATION.CHECK_PENDING(userId));
                setHavePendingBooking(response.data);
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

    const handleCheckboxChange = (e) => {
        setIsConfirmed(e.target.checked);
    };

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

    const handleIncrement = (food) => {
        setPreorders((prevPreorders) => ({
            ...prevPreorders,
            [food.id]: {
                ...(prevPreorders[food.id] || {
                    quantity: 0,
                    name: food.name,
                    basePrice: food.basePrice,
                    imagePath: food.imagePath,
                }),
                quantity: (prevPreorders[food.id]?.quantity || 0) + 1,
            },
        }));
    };

    const handleDecrement = (food) => {
        setPreorders((prevPreorders) => {
            const currentQuantity = prevPreorders[food.id]?.quantity || 0;
            if (currentQuantity <= 1) {
                // Remove the item from preorders if quantity is 0 or less
                // @ts-ignore
                const { [food.id]: _, ...rest } = prevPreorders;
                return rest;
            }
            return {
                ...prevPreorders,
                [food.id]: {
                    ...prevPreorders[food.id],
                    quantity: currentQuantity - 1,
                },
            };
        });
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
                        Chọn món để đặt trước
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
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleIncrement(food);
                                                    }}
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
                                const { name, basePrice, imagePath, quantity } = preorders[key];
                                const food = preorders[key];
                                food.id = key;
                                return (
                                    <List.Item>
                                        <div style={{ display: 'flex', width: '100%' }}>
                                            <Image
                                                preview={false}
                                                width={100}
                                                src={`${axiosInstance.defaults.baseURL}/${imagePath}`}
                                                alt={name}
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
                                                    {name}
                                                </Typography.Text>
                                                <div style={{ marginTop: '8px' }}>
                                                    <Typography.Text
                                                        strong
                                                        style={{
                                                            fontSize: '14px',
                                                            color: '#555',
                                                        }}
                                                    >
                                                        Giá: {basePrice}đ
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
                                                        <Button
                                                            size="small"
                                                            onClick={() => handleDecrement(food)}
                                                        >
                                                            -
                                                        </Button>
                                                        <Typography.Text>{quantity}</Typography.Text>
                                                        <Button
                                                            size="small"
                                                            onClick={() => handleIncrement(food)}
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

                            <div
                                style={{
                                    marginTop: 'auto',
                                    borderTop: '1px solid #d9d9d9',
                                    paddingTop: '16px',
                                }}
                            >
                                <Typography.Text strong style={{ fontSize: '16px' }}>
                                    Tổng Giá:{" "}
                                    {Object.values(preorders).reduce(
                                        (sum, { basePrice, quantity }) => sum + basePrice * quantity,
                                        0)}đ
                                </Typography.Text>
                            </div>)}
                        <div
                            style={{
                                marginTop: '16px',
                                textAlign: 'center',
                            }}
                        >
                            {isConfirmed && (
                                <Tooltip title={havePendingBooking ? 'Quý khách hiện đang có yêu cầu đặt chỗ vẫn chưa được xử lý, xin vui lòng xác nhận lại trước khi đặt chỗ' 
                                : 'Hãy kiểm tra kỹ thông tin trước khi đặt chỗ'}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={onFinish}
                                        disabled={havePendingBooking || !isFormValid}
                                        style={{
                                            width: '100%',
                                            borderRadius: '8px',
                                            marginBottom: '16px',
                                        }}
                                    >
                                        Hoàn Thành Đặt Chỗ
                                    </Button>
                                </Tooltip>)}

                            <Checkbox onChange={handleCheckboxChange}>Tôi xác nhận là sẽ đến đúng giờ.</Checkbox>

                            <Typography style={{ color: 'red' }}>
                                Quý khách vui lòng đến đúng giờ, nhà sẽ chỉ giữ bàn muộn hơn 10 phút so với giờ đặt bàn nhé!
                            </Typography>

                        </div>
                    </div>
                </Col>

            </Row>
        </div>
    );
};

export default FoodPreorderSection;
