import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Input, Pagination, message, Spin, Image, Menu, Collapse } from 'antd';
import axiosInstance from '../../service/axios';
import { apiEndPoints } from '../../constaints/apiEndPoint';

const { Panel } = Collapse;


const FoodPreorderSection = ({ onPreorder }) => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [preorders, setPreorders] = useState({});

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
            const { imagePath, name } = food;
            onPreorder({ imagePath, name, isOption }, quantity);
            message.success(`Preordered ${quantity} of ${food.name}`);
        } else {
            message.warning(`Please select a quantity to preorder`);
        }
    };

    const renderFoodOptions = (food) => (
        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '1px' }}>
            {food.options.map((option) => (
                <Card
                    key={option.id}
                    hoverable
                    cover={
                        <div style={{ overflow: 'hidden', height: '20vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                alt={option.name}
                                src={`${axiosInstance.defaults.baseURL}/${option.imagePath}`}
                            />
                        </div>
                    }
                    style={{ marginBottom: '16px' }}
                >
                    <Card.Meta title={option.name} description={`Additional Price: ${option.additionalPrice}`} />
                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Button onClick={() => handleDecrement(option.id)}>-</Button>
                            <span style={{ margin: '0 8px' }}>{preorders[option.id]?.quantity || 0}</span>
                            <Button onClick={() => handleIncrement(option.id, true)}>+</Button>
                        </div>
                        <Button type="primary" onClick={() => handlePreorder(option, true)}>
                            Preorder
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );



    return (
        <div style={{ border: '1px solid #d9d9d9', padding: '24px', borderRadius: '8px', marginTop: '24px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '24px' }}>Preorder Food for Your Booking</h3>
            <Input.Search
                placeholder="Search food"
                onSearch={(value) => setSearch(value)}
                style={{ marginBottom: 24 }}
            />
            <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                    {foods.map((food) => (
                        <Col key={food.id} xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                cover={
                                    <div style={{ overflow: 'hidden', height: '20vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            alt={food.name}
                                            src={`${axiosInstance.defaults.baseURL}/${food.imagePath}`}
                                        />
                                    </div>
                                }
                            >
                                <Card.Meta title={food.name} description={`Price: ${food.basePrice}`} />
                                <div style={{ marginTop: 16 }}>
                                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <Button onClick={() => handleDecrement(food.id)}>-</Button>
                                            <span style={{ margin: '0 8px' }}>{preorders[food.id]?.quantity || 0}</span>
                                            <Button onClick={() => handleIncrement(food.id)}>+</Button>
                                        </div>
                                        <Button type="primary" onClick={() => handlePreorder(food)}>
                                            Preorder
                                        </Button>
                                    </div>
                                    {food.options.length > 0 && (
                                        <Collapse bordered={false}>
                                            <Panel header="Show Options" key="1">
                                                {renderFoodOptions(food)}
                                            </Panel>
                                        </Collapse>
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
                style={{ marginTop: 24, textAlign: 'center' }}
            />
        </div>
    );
};

export default FoodPreorderSection;
