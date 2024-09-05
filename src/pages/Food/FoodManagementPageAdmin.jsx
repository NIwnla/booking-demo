import React, { useState, useEffect } from "react";
import { Card, Button, Input, Pagination, Row, Col, message, Spin, Image, Popconfirm } from "antd";
import axiosInstance from "../../service/axios";
import { apiEndPoints } from "../../constaints/apiEndPoint";
import { AxiosConstants } from "../../constaints/axiosContaint";
import CreateFoodModal from "../../components/modals/food/CreateFoodModal";
import { useNavigate } from "react-router-dom";

const FoodManagementPageAdmin = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [selectedFood, setSelectedFood] = useState(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const navigate = useNavigate();

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

    const handleOptions = (foodId) => {
        navigate(`/food-options/management/${foodId}`);
    };

    const handleEdit = (foodId) => {
        // Implement the edit functionality
        message.info("Edit functionality is not implemented yet.");
    };

    const handleDelete = async (foodId) => {
        try {
            await axiosInstance.delete(apiEndPoints.FOOD.DELETE(foodId));
            message.success('Food deleted successfully.');
            fetchFoods();
        } catch (error) {
            message.error('Failed to delete food.');
        }
    };

    const handleFoodCreated = () => {
        fetchFoods(); // Refresh the list when a new food is created
    };

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <Input.Search
                    placeholder="Search food"
                    onSearch={(value) => setSearch(value)}
                    style={{ maxWidth: "30vw" }}
                />
                <Button type="primary" onClick={() => setCreateModalVisible(true)}>
                    Create Food
                </Button>
            </div>
            <Spin spinning={loading}>

                <Row gutter={[16, 16]}>
                    {foods.map((food) => (
                        <Col key={food.id} xs={24} sm={12} md={6}>
                            <Card
                                hoverable
                                cover={
                                    <div style={{ overflow: "hidden", height: "30vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Image
                                            alt={food.name}
                                            src={`${AxiosConstants.AXIOS_BASEURL}/${food.imagePath}`}
                                        />
                                    </div>
                                }
                            >
                                <Card.Meta title={food.name} description={`Price: ${food.basePrice}`} />
                                <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: "8px" }}>
                                    <Button type="primary" style={{ flex: 1, maxWidth: "7vw" }} onClick={() => handleOptions(food.id)}>
                                        Options
                                    </Button>
                                    <Button style={{ flex: 1, maxWidth: "7vw" }} onClick={() => handleEdit(food.id)}>
                                        Edit
                                    </Button>
                                    <Popconfirm
                                        title="Are you sure you want to delete this food?"
                                        onConfirm={() => handleDelete(food.id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                    <Button danger style={{ flex: 1, maxWidth: "7vw" }}>
                                        Delete
                                    </Button>
                                    </Popconfirm>
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
                style={{ marginTop: 24, textAlign: "center" }}
            />
            <CreateFoodModal
                visible={createModalVisible}
                onClose={() => setCreateModalVisible(false)}
                onFoodCreated={handleFoodCreated}
            />
        </div>
    );
};

export default FoodManagementPageAdmin;
