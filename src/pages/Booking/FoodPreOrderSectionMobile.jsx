import { DownOutlined, MinusOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import {
    App,
    Button,
    Collapse,
    Image,
    Input,
    List,
    Space,
    Spin,
    Tooltip,
    Typography,
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../service/axios';
import FoodDeliveryDetailModal from '../../components/modals/delivery/FoodDeliveryDetailModal';
import { getLocalizedText } from '../../helpers/getLocalizedText';

const FoodPreOrderSectionMobile = ({ onPreorder, onFinish, isFormValid }) => {
    const { t, i18n } = useTranslation('global');
    const { userId } = useContext(AuthContext);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState('');
    const [preorders, setPreorders] = useState({});
    const [havePendingDelivery, setHavePendingDelivery] = useState(false);
    const [cartVisible, setCartVisible] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { message } = App.useApp();

    useEffect(() => {
        const checkPendingDelivery = async () => {
            try {
                const response = await axiosInstance.get(apiEndPoints.DELIVERY_INFORMATION.CHECK_PENDING(userId));
                setHavePendingDelivery(response.data);
            } catch (error) {
                console.error(t('booking.foodChoice.messages.fetchFoodsError'), error);
            }
        };

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
            message.error(t('booking.foodChoice.messages.fetchFoodsError'));
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
            message.error(t('booking.foodChoice.messages.fetchFoodsError'));
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
            const currentQuantity = preorders[food.id]?.quantity || 0;
            if (currentQuantity <= 1) {
                // @ts-ignore
                const { [food.id]: _, ...rest } = preorders;
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
        <div style={{ backgroundColor: '#f0f0f0', padding: '16px' }}>
            <Input.Search
                placeholder={t('booking.foodChoice.placeholders.searchFood')}
                onSearch={(value) => setSearch(value)}
                style={{ marginBottom: 16 }}
            />
            <Spin spinning={loading}>
                <List
                    dataSource={foods}
                    renderItem={(food) => (
                        <List.Item
                            key={food.id}
                            onClick={() => fetchFoodDetails(food.id)}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Image
                                        preview={false}
                                        width={80}
                                        src={`${axiosInstance.defaults.baseURL}/${food.imagePath}`}
                                        alt={getLocalizedText(food,'name', i18n.language)}
                                    />
                                }
                                title={getLocalizedText(food,'name', i18n.language)}
                                description={
                                    <div>
                                        <Typography.Text>
                                            {food.description || t('booking.foodChoice.messages.noDescription')}
                                        </Typography.Text>
                                        <br />
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                                            <strong>
                                                {food.basePrice}đ
                                            </strong>
                                            <Space>
                                                {preorders[food.id]?.quantity > 0 && (
                                                    <>
                                                        <Button
                                                            icon={<MinusOutlined />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDecrement(food);
                                                            }}
                                                        />
                                                        <Typography.Text>
                                                            {preorders[food.id]?.quantity || 0}
                                                        </Typography.Text>
                                                    </>
                                                )}
                                                <Button
                                                    icon={<PlusOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleIncrement(food);
                                                    }}
                                                />
                                            </Space>
                                        </div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                    pagination={{
                        current: pageIndex,
                        pageSize,
                        total: totalCount,
                        onChange: (page, pageSize) => {
                            setPageIndex(page);
                            setPageSize(pageSize);
                        },
                    }}
                />
            </Spin>
            {Object.keys(preorders).length > 0 && (
                <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, boxShadow: '0 -2px 8px rgba(0,0,0,0.1)', backgroundColor: '#fff', zIndex: 1000 }}>
                    <Collapse
                        activeKey={cartVisible ? ['1'] : []}
                        onChange={(key) => setCartVisible(key.includes('1'))}
                        bordered={false}
                        items={[
                            {
                                showArrow: false,
                                key: '1',
                                label: (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Button type="link" icon={cartVisible ? <DownOutlined /> : <UpOutlined />}>
                                            {cartVisible ? t('booking.foodChoice.cart.hide') : `${t('booking.foodChoice.cart.title')} (${Object.keys(preorders).length})`}
                                        </Button>
                                        <Button
                                            type="primary"
                                            disabled={!isFormValid || havePendingDelivery}
                                            onClick={onFinish}
                                        >
                                            {havePendingDelivery ? t('booking.foodChoice.buttons.havePendingBooking') : t('booking.foodChoice.buttons.completeBooking')}
                                        </Button>
                                    </div>
                                ),
                                children: (
                                    <List
                                        dataSource={Object.keys(preorders)}
                                        renderItem={(key) => {
                                            const { name, basePrice, imagePath, quantity } = preorders[key];
                                            const food = preorders[key];
                                            food.id = key;
                                            return (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<Image preview={false} width={80} src={`${axiosInstance.defaults.baseURL}/${imagePath}`} alt={name} />}
                                                        title={name}
                                                        description={`${t('booking.foodChoice.cart.price')}: ${basePrice}đ`}
                                                    />
                                                    <Space>
                                                        <Button icon={<MinusOutlined />} onClick={() => handleDecrement(food)} />
                                                        <Typography.Text>{quantity}</Typography.Text>
                                                        <Button icon={<PlusOutlined />} onClick={() => handleIncrement(food)} />
                                                    </Space>
                                                </List.Item>
                                            );
                                        }}
                                    />
                                ),
                            },
                        ]}
                    />
                </div>
            )}
            {selectedFood && (
                <FoodDeliveryDetailModal
                    visible={isModalVisible}
                    food={selectedFood}
                    onClose={() => setIsModalVisible(false)}
                    onIncrement={handleIncrement}
                />
            )}
        </div>
    );
};

export default FoodPreOrderSectionMobile;