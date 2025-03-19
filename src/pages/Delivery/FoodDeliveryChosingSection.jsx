import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import {
    App,
    Button,
    Card,
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
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FoodDeliveryDetailModal from './components/FoodDeliveryDetailModal';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../service/axios';
import { getLocalizedText } from '../../helpers/getLocalizedText';

const FoodDeliveryChosingSection = ({ onPreorder, onFinish, isFormValid }) => {
    const { t, i18n } = useTranslation("global");
    const { userId } = useContext(AuthContext);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState('');
    const [preorders, setPreorders] = useState({});
    const [havePendingDelivery, setHavePendingDelivery] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
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
    }, [userId]);

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
            message.error(t('delivery.foodChoice.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    const fetchFoodDetails = async (id) => {
        try {
            const response = await axiosInstance.get(apiEndPoints.FOOD.GET_BY_ID(id));
            setSelectedFood(response.data);
            setIsModalVisible(true);
        } catch (error) {
            message.error(t('delivery.foodChoice.fetchFoodDetailsError'));
        }
    };

    const handleIncrement = (food) => {
        setPreorders((prevPreorders) => ({
            ...prevPreorders,
            [food.id]: {
                ...(prevPreorders[food.id] || {
                    quantity: 0,
                    nameVN: food.nameVN,
                    nameEN: food.nameEN,
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
                <Col xs={24} sm={24} md={12} lg={15} xl={18}>
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
                        {t('delivery.foodChoice.title')}
                    </Typography.Title>
                    <Input.Search
                        placeholder={t('delivery.foodChoice.searchFood')}
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
                                <Col key={food.id} xs={24} md={24} lg={12} xl={8}>
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
                                                    alt={getLocalizedText(food, 'name', i18n.language)}
                                                    src={`${axiosInstance.defaults.baseURL}/${food.imagePath}`}
                                                />
                                            </div>
                                        }
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                        onClick={() => fetchFoodDetails(food.id)}
                                    >
                                        <Card.Meta
                                            title={getLocalizedText(food, 'name', i18n.language)}
                                            description={
                                                food.description || t('delivery.foodChoice.noDescription')
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
                                                <strong><ShoppingCartOutlined />{food.basePrice}VND</strong>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {preorders[food.id]?.quantity > 0 && (
                                                        <Button
                                                            type="default"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDecrement(food);
                                                            }}
                                                        >
                                                            <MinusOutlined />
                                                        </Button>
                                                    )}
                                                    {preorders[food.id]?.quantity > 0 && (
                                                        <span
                                                            style={{
                                                                fontSize: '16px',
                                                                fontWeight: 'bold',
                                                                minWidth: '20px',
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            {preorders[food.id]?.quantity}
                                                        </span>
                                                    )}
                                                    <Button
                                                        type="primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleIncrement(food);
                                                        }}
                                                    >
                                                        <PlusOutlined />
                                                    </Button>
                                                </div>
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
                <Col xs={24} sm={24} md={12} lg={9} xl={6}>
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
                                {t('delivery.foodChoice.shoppingCart')}
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
                                {t('delivery.foodChoice.clearAll')}
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
                                                        {t('delivery.foodChoice.price')}: {basePrice}VND
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
                                                {t('delivery.foodChoice.emptyCart')}
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
                                        {t('delivery.foodChoice.total')}:{" "}
                                        {Object.values(preorders).reduce(
                                            (sum, { basePrice, quantity }) => sum + basePrice * quantity,
                                            0)}VND
                                    </Typography.Text>
                                </div>
                                <div
                                    style={{
                                        marginTop: '16px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Tooltip title={havePendingDelivery ? t('delivery.foodChoice.pendingDelivery') : ''}>
                                        <Button
                                            type="primary"
                                            size="large"
                                            onClick={onFinish}
                                            disabled={havePendingDelivery || !isFormValid}
                                            style={{
                                                width: '100%',
                                                borderRadius: '8px',
                                            }}
                                        >
                                            {t('delivery.foodChoice.proceedToCheckout')}
                                        </Button>
                                    </Tooltip>
                                </div>
                            </>
                        )}

                        {/* Food Details Modal */}
                        <FoodDeliveryDetailModal
                            visible={isModalVisible}
                            food={selectedFood}
                            onClose={() => setIsModalVisible(false)}
                            onIncrement={handleIncrement}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default FoodDeliveryChosingSection;
