import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import {
    App,
    Button,
    Card,
    Checkbox,
    Col,
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
import React, { useEffect, useState, useContext } from 'react';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import axiosInstance from '../../service/axios';
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const FoodPreorderSection = ({ onPreorder, onFinish, isFormValid }) => {
    const { t } = useTranslation('global');
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
                console.error(t('booking.foodChoice.messages.fetchFoodsError'), error);
            }
        };

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
            message.error(t('booking.foodChoice.messages.fetchFoodsError'));
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
        <div style={{ backgroundColor: '#f0f0f0', padding: '24px', borderRadius: '8px', marginTop: '24px' }}>
            <Row gutter={[16, 16]}>
                {/* Left Section: Available Foods */}
                <Col xs={24} sm={24} lg={18}>
                    <Typography.Title
                        level={4}
                        style={{ textAlign: 'center', marginBottom: '24px', backgroundColor: '#fff', padding: '12px', borderRadius: '8px' }}
                    >
                        {t('booking.foodChoice.titles.availableFoods')}
                    </Typography.Title>
                    <Input.Search
                        placeholder={t('booking.foodChoice.placeholders.searchFood')}
                        onSearch={(value) => setSearch(value)}
                        style={{ marginBottom: 24, backgroundColor: '#fff', borderRadius: '8px' }}
                    />
                    <Spin spinning={loading}>
                        <Row gutter={[16, 16]}>
                            {foods.map((food) => (
                                <Col key={food.id} xs={24} sm={12} md={8} lg={8} xl={8}>
                                    <Card
                                        hoverable
                                        style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease' }}
                                        cover={
                                            <div style={{ overflow: 'hidden', height: '20vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <Image preview={false} alt={food.name} src={`${axiosInstance.defaults.baseURL}/${food.imagePath}`} />
                                            </div>
                                        }
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    >
                                        <Card.Meta title={food.name} description={food.description || t('booking.foodChoice.messages.noDescription')} />
                                        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>
                                                <ShoppingCartOutlined />
                                                {food.basePrice}đ
                                            </strong>
                                            <Button type="primary" onClick={() => handleIncrement(food)}>
                                                <PlusOutlined />
                                            </Button>
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
                    <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <Typography.Title level={4} style={{ margin: 0 }}>
                                {t('booking.foodChoice.cart.title')}
                            </Typography.Title>
                            <Button type="text" danger onClick={() => setPreorders({})}>
                                {t('booking.foodChoice.buttons.clearCart')}
                            </Button>
                        </div>
                        <List
                            dataSource={Object.keys(preorders).filter((key) => preorders[key]?.quantity > 0)}
                            renderItem={(key) => {
                                const { name, basePrice, imagePath, quantity } = preorders[key];
                                const food = preorders[key];
                                food.id = key;
                                return (
                                    <List.Item>
                                        <div style={{ display: 'flex', width: '100%' }}>
                                            <Image preview={false} width={100} src={`${axiosInstance.defaults.baseURL}/${imagePath}`} alt={name} />
                                            <div style={{ marginLeft: '16px', flex: 1 }}>
                                                <Typography.Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{name}</Typography.Text>
                                                <div>
                                                    <Typography.Text strong>{t('booking.foodChoice.cart.price')}: {basePrice}đ</Typography.Text>
                                                </div>
                                                <div style={{ marginTop: '8px' }}>
                                                    <Space>
                                                        <Button size="small" onClick={() => handleDecrement(food)}>-</Button>
                                                        <Typography.Text>{quantity}</Typography.Text>
                                                        <Button size="small" onClick={() => handleIncrement(food)}>+</Button>
                                                    </Space>
                                                </div>
                                            </div>
                                        </div>
                                    </List.Item>
                                );
                            }}
                            locale={{
                                emptyText: (
                                    <Empty description={<Typography.Text>{t('booking.foodChoice.messages.emptyCart')}</Typography.Text>} />
                                ),
                            }}
                        />
                        <div style={{ marginTop: 16 }}>
                            <Typography.Text strong>
                                {t('booking.foodChoice.cart.totalPrice')}:{" "}
                                {Object.values(preorders).reduce((sum, { basePrice, quantity }) => sum + basePrice * quantity, 0)}đ
                            </Typography.Text>
                        </div>
                        <div style={{ marginTop: 16 }}>
                            {isConfirmed &&
                                (<Tooltip title={havePendingBooking ? t('booking.foodChoice.messages.pendingBooking') : t('booking.foodChoice.messages.confirmInfo')}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={onFinish}
                                        disabled={havePendingBooking || !isFormValid}
                                        style={{ width: '100%', marginBottom: '16px' }}
                                    >
                                        {t('booking.foodChoice.buttons.completeBooking')}
                                    </Button>
                                </Tooltip>)
                            }

                            <Checkbox onChange={handleCheckboxChange}>{t('booking.foodChoice.labels.confirmArrival')}</Checkbox>
                            <Typography.Text style={{ color: 'red' }}>{t('booking.foodChoice.messages.arriveOnTime')}</Typography.Text>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default FoodPreorderSection;
