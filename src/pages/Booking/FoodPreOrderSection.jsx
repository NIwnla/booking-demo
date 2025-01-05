import { App, Button, Card, Col, Collapse, Image, Input, Pagination, Row, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import axiosInstance from '../../service/axios';

// @ts-ignore
const { Panel } = Collapse;

const FoodPreorderSection = ({ onPreorder }) => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [preorders, setPreorders] = useState({});
    const { message } = App.useApp();

    useEffect(() => {
        fetchFoods();
    }, [pageIndex, pageSize, search]);

    const fetchFoods = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.FOOD.GET_ALL, {
                params: { pageIndex, pageSize, search },
            });
            setFoods(response.data.items);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            message.error("Failed to fetch foods.");
        } finally {
            setLoading(false);
        }
    };

    const handleIncrement = (itemId, isOption = false) => {
        setPreorders((prevPreorders) => ({
            ...prevPreorders,
            [itemId]: {
                ...(prevPreorders[itemId] || { quantity: 0, isOption }),
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

    const handlePreorder = (food, isOption = false) => {
        const quantity = preorders[food.id]?.quantity || 0;
        if (quantity > 0) {
            const { id, imagePath, name } = food;
            onPreorder({ id, imagePath, name, isOption }, quantity);
            message.success(`Preordered ${quantity} of ${food.name}`);
           
        } else {
            message.warning("Please select a quantity to preorder");
        }
    };

    const renderFoodOptions = (food) => (
        <div
            // @ts-ignore
            style={styles.foodOptionsContainer}>
            {food.options.map((option) => (
                <Card
                    key={option.id}
                    hoverable
                    cover={
                        <div style={styles.foodOptionImageContainer}>
                            <Image
                                alt={option.name}
                                src={`${axiosInstance.defaults.baseURL}/${option.imagePath}`}
                            />
                        </div>
                    }
                    style={styles.foodOptionCard}
                >
                    <Card.Meta title={option.name} description={`Additional Price: ${option.price}`} />
                    <div style={styles.foodOptionControls}>
                        <Space wrap>
                            <Button onClick={() => handleDecrement(option.id)}>-</Button>
                            <Button style={{ pointerEvents: 'none' }}>{preorders[option.id]?.quantity || 0}</Button>
                            <Button onClick={() => handleIncrement(option.id, true)}>+</Button>
                        </Space>
                        <Button type="primary" onClick={() => handlePreorder(option, true)} style={styles.preorderButton}>
                            Preorder
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );

    return (
        <div style={styles.container}>
            <h3
                // @ts-ignore
                style={styles.title}>Đặt trước đồ ăn</h3>
            <Input.Search
                placeholder="Search food"
                onSearch={(value) => setSearch(value)}
                style={styles.searchBar}
            />
            <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                    {foods.map((food) => (
                        <Col key={food.id} xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
                            <Card
                                hoverable
                                cover={
                                    <div style={styles.foodImageContainer}>
                                        <Image
                                            alt={food.name}
                                            src={`${axiosInstance.defaults.baseURL}/${food.imagePath}`}
                                        />
                                    </div>
                                }
                            >
                                <Card.Meta title={food.name} description={`Price: ${food.basePrice}`} />
                                <div style={styles.foodControls}>
                                    <div style={styles.quantityControls}>
                                        <Space wrap>
                                            <Button onClick={() => handleDecrement(food.id)}>-</Button>
                                            <Button style={{ pointerEvents: 'none' }}>{preorders[food.id]?.quantity || 0}</Button>
                                            <Button onClick={() => handleIncrement(food.id)}>+</Button>
                                        </Space>
                                        <Button type="primary" onClick={() => handlePreorder(food)} style={styles.preorderButton}>
                                            Preorder
                                        </Button>
                                    </div>
                                    {food.options.length > 0 && (
                                        <Collapse bordered={false} items={[{ key: '1', label: 'Show Options', children: renderFoodOptions(food) }]} />
                                    )}
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
                // @ts-ignore
                style={styles.pagination}
            />
        </div>
    );
};

export default FoodPreorderSection;

const styles = {
    container: {
        border: '1px solid #d9d9d9',
        padding: '24px',
        borderRadius: '8px',
        marginTop: '24px',
    },
    title: {
        textAlign: 'center',
        marginBottom: '24px',
    },
    searchBar: {
        marginBottom: 24,
    },
    foodImageContainer: {
        overflow: 'hidden',
        height: '20vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    foodControls: {
        marginTop: 16,
    },
    quantityControls: {
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    foodOptionsContainer: {
        maxHeight: '60vh',
        overflowY: 'auto',
        padding: '1px',
    },
    foodOptionCard: {
        marginBottom: '16px',
    },
    foodOptionImageContainer: {
        overflow: 'hidden',
        height: '20vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    foodOptionControls: {
        marginTop: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    preorderButton: {
        maxWidth: '20vw',
    },
    pagination: {
        marginTop: 24,
        textAlign: 'center',
    },
};
