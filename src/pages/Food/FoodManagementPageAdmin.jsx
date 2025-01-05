import { App, Button, Card, Col, Image, Input, Pagination, Popconfirm, Row, Space, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateFoodModal from "../../components/modals/food/CreateFoodModal";
import EditFoodModal from "../../components/modals/food/EditFoodModal";
import { apiEndPoints } from "../../constaints/apiEndPoint";
import { AxiosConstants } from "../../constaints/axiosContaint";
import axiosInstance from "../../service/axios";
import './FoodManagementPageAdmin.css';

const FoodManagementPageAdmin = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [selectedFood, setSelectedFood] = useState(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const { message } = App.useApp();
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

    const handleEdit = (food) => {
        setSelectedFood(food);
        setEditModalVisible(true);
    };

    const handleFoodUpdated = () => {
        fetchFoods(); // Refresh list after editing
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
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={12}>
                    <Input.Search
                        placeholder="Search food"
                        onSearch={(value) => setSearch(value)}
                        style={{ width: '100%' }}  // Ensures it takes full width on smaller screens
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Button type="primary" onClick={() => setCreateModalVisible(true)} style={{ width: '100%' }}>
                        Create Food
                    </Button>
                </Col>
            </Row>
            <Spin spinning={loading}>

                <Row gutter={[16, 16]}>
                    {foods.map((food) => (
                        <Col key={food.id} xs={24} sm={12} md={12} lg={6}>
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
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                                    <Space wrap>
                                        <Button type="primary" style={{ maxWidth: "15vw" }} onClick={() => handleOptions(food.id)}>
                                            Options
                                        </Button>
                                        <Button style={{ maxWidth: "15vw" }} onClick={() => handleEdit(food)}>
                                            Edit
                                        </Button>
                                        <Popconfirm
                                            title="Are you sure you want to delete this food?"
                                            onConfirm={() => handleDelete(food.id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button danger style={{ maxWidth: "15vw" }}>
                                                Delete
                                            </Button>
                                        </Popconfirm>
                                    </Space>
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
            <EditFoodModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                onFoodUpdated={handleFoodUpdated}
                food={selectedFood}
            />
        </div>
    );
};

export default FoodManagementPageAdmin;
