import { DownOutlined, MinusOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
import {
    App,
    Button,
    Collapse,
    Image,
    Input,
    List,
    Spin,
    Tooltip,
    Typography
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../service/axios';
import FoodDeliveryDetailModal from '../../components/modals/delivery/FoodDeliveryDetailModal';


const FoodPreOrderSectionMobile = ({ onPreorder, onFinish, isFormValid }) => {
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
                console.error('Failed to check pending delivery:', error);
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
            message.error('Failed to fetch foods.');
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
            message.error('Failed to fetch food details.');
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


    const renderFoodItem = (food) => (
        <List.Item
            key={food.id}
            actions={[
                <Button
                    icon={<MinusOutlined />}
                    disabled={!(preorders[food.id]?.quantity > 0)}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDecrement(food);
                    }}
                />,
                <Typography.Text>{preorders[food.id]?.quantity || 0}</Typography.Text>,
                <Button
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleIncrement(food);
                    }}
                />,
            ]}
            onClick={() => fetchFoodDetails(food.id)}
        >
            <List.Item.Meta
                avatar={
                    <Image
                        preview={false}
                        width={80}
                        src={`${axiosInstance.defaults.baseURL}/${food.imagePath}`}
                        alt={food.name}
                    />
                }
                title={food.name}
                description={
                    <>
                        <Typography.Text>{food.description || 'No description available'}</Typography.Text>
                        <br />
                        <Typography.Text strong>{food.basePrice}đ</Typography.Text>
                    </>
                }
            />
        </List.Item>
    );

    return (
        <div style={{ backgroundColor: '#f0f0f0', padding: '16px' }}>
            {/* Search and Food List */}
            <Input.Search
                placeholder="Tìm món ăn"
                onSearch={(value) => setSearch(value)}
                style={{ marginBottom: 16 }}
            />
            <Spin spinning={loading}>
                <List
                    dataSource={foods}
                    renderItem={renderFoodItem}
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

            {/* Floating Footer with Collapsible Cart */}
            {Object.keys(preorders).length > 0 && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: '#fff',
                        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                    }}
                >
                    <Collapse
                        activeKey={cartVisible ? ['1'] : []}
                        onChange={(key) => setCartVisible(key.includes('1'))}
                        bordered={false}
                        items={[
                            {
                                key: '1',
                                label: (
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Button
                                            type="link"
                                        >
                                            {cartVisible ? 'Hide Cart' : `Xe hàng (${Object.keys(preorders).length})`}
                                        </Button>

                                        {havePendingDelivery && (
                                            <Typography.Text type="danger" style={{ marginRight: 16 }}>
                                                Quý khách hiện đang có yêu cầu đặt chỗ vẫn chưa được xử lý, xin vui lòng xác nhận lại trước khi đặt chỗ.
                                            </Typography.Text>
                                        )}
                                        {!havePendingDelivery && (
                                            <Button
                                                type="primary"
                                                disabled={!isFormValid}
                                                onClick={onFinish}
                                            >
                                                Hoàn tất đặt chỗ
                                            </Button>
                                        )}
                                    </div>
                                ),
                                children: (
                                    <>
                                        <Typography.Title level={4}>
                                            <Typography.Text>Tổng: {Object.values(preorders).reduce(
                                                (sum, { basePrice, quantity }) => sum + basePrice * quantity,
                                                0)}đ
                                            </Typography.Text>
                                        </Typography.Title>
                                        <List
                                            dataSource={Object.keys(preorders).filter(
                                                (key) => preorders[key]?.quantity > 0
                                            )}
                                            renderItem={(key) => {
                                                const { name, basePrice, imagePath, quantity } = preorders[key];
                                                const food = preorders[key];
                                                food.id = key;
                                                return (
                                                    <List.Item
                                                        actions={[
                                                            <Button
                                                                icon={<MinusOutlined />}
                                                                disabled={quantity <= 1}
                                                                onClick={() => handleDecrement(food)}
                                                            />,
                                                            <Typography.Text>{quantity}</Typography.Text>,
                                                            <Button
                                                                icon={<PlusOutlined />}
                                                                onClick={() => handleIncrement(food)}
                                                            />,
                                                        ]}
                                                    >
                                                        <List.Item.Meta
                                                            avatar={
                                                                <Image
                                                                    preview={false}
                                                                    width={80}
                                                                    src={`${axiosInstance.defaults.baseURL}/${imagePath}`}
                                                                    alt={name}
                                                                />
                                                            }
                                                            title={name}
                                                            description={
                                                                <Typography.Text strong>{`${basePrice}đ`}</Typography.Text>
                                                            }
                                                        />
                                                    </List.Item>
                                                );
                                            }}
                                        />
                                    </>
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
