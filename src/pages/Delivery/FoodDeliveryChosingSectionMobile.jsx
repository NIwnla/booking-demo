import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons';
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

const { Panel } = Collapse;


const FoodDeliveryChosingSectionMobile = ({ onPreorder, onFinish }) => {
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
    }, [preorders, onPreorder]);

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

    const renderFoodItem = (food) => (
        <List.Item
            key={food.id}
            actions={[<Button icon={<PlusOutlined />} onClick={() => handleIncrement(food.id)} />]}
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
                    >
                        <Panel
                            header={
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Button
                                        type="link"
                                        icon={cartVisible ? <UpOutlined /> : <DownOutlined />}
                                    >
                                        {cartVisible ? 'Hide Cart' : `Xe hàng (${Object.keys(preorders).length})`}
                                    </Button>
                                    <Tooltip
                                        title={
                                            havePendingDelivery
                                                ? 'You have a pending delivery. Complete it before placing a new order.'
                                                : ''
                                        }
                                    >
                                        <Button
                                            type="primary"
                                            disabled={havePendingDelivery}
                                            onClick={onFinish}
                                        >
                                            Hoàn tất đơn hàng
                                        </Button>
                                    </Tooltip>
                                </div>
                            }
                            key="1"
                        >
                            <List
                                dataSource={Object.keys(preorders).filter(
                                    (key) => preorders[key]?.quantity > 0
                                )}
                                renderItem={(key) => {
                                    const food = foods.find((item) => item.id === key) || {};
                                    const quantity = preorders[key]?.quantity || 0;
                                    return (
                                        <List.Item>
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
                                                description={`Quantity: ${quantity}`}
                                            />
                                        </List.Item>
                                    );
                                }}
                            />
                        </Panel>
                    </Collapse>
                </div>
            )}
        </div>
    );
};

export default FoodDeliveryChosingSectionMobile;
