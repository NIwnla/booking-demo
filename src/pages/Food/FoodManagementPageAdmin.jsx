import React, { useEffect, useState } from "react";
import { App, Button, Card, Col, Image, Input, Pagination, Popconfirm, Row, Space, Spin, Tag, Typography } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiEndPoints } from "../../constaints/apiEndPoint";
import { AxiosConstants } from "../../constaints/axiosContaint";
import axiosInstance from "../../service/axios";
import './FoodManagementPageAdmin.css';
import { getLocalizedText } from "../../helpers/getLocalizedText";
import { routeNames } from "../../constaints/routeName";
import CreateFoodModal from "./components/CreateFoodModal";
import EditFoodModal from "./components/EditFoodModal";

const FoodManagementPageAdmin = () => {
    const { t, i18n } = useTranslation('global');
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
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
            message.error(t("food.management.messages.fetchError"));
        } finally {
            setLoading(false);
        }
    };

    const handleOptions = (foodId) => {
        navigate(`${routeNames.foodOption.management}${foodId}`);
    };

    const handleEdit = (food) => {
        setSelectedFood(food);
        setEditModalVisible(true);
    };

    const handleFoodUpdated = () => {
        fetchFoods();
    };

    const handleDelete = async (foodId) => {
        try {
            await axiosInstance.delete(apiEndPoints.FOOD.DELETE(foodId));
            message.success(t("food.management.messages.deleteSuccess"));
            fetchFoods();
        } catch (error) {
            message.error(t("food.management.messages.deleteError"));
        }
    };

    const handleFoodCreated = () => {
        fetchFoods();
    };

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={12}>
                    <Button
                        type="primary"
                        onClick={() => setCreateModalVisible(true)}
                        style={{ width: '100%' }}
                    >
                        {t("food.management.buttons.createFood")}
                    </Button>
                </Col>
                <Col xs={24} md={12}>
                    <Input.Search
                        placeholder={t("food.management.placeholders.search")}
                        onSearch={(value) => setSearch(value)}
                        style={{ width: '100%' }}
                    />
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
                                <Card.Meta
                                    title={getLocalizedText(food, 'name', i18n.language)}
                                    description={getLocalizedText(food, 'description', i18n.language) || t("food.management.card.noDescription")}
                                />
                                <Typography style={{ marginTop: "2vh", display: "flex", alignItems: "center" }}>
                                    <ShoppingCartOutlined />
                                    <strong>{t("food.management.card.price")}: {food.basePrice}đ</strong>
                                </Typography>

                                {food.categories.length > 0 ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {food.categories.map(category => (
                                            <Tag key={category.id} color="blue">{getLocalizedText(category, 'name', i18n.language)}</Tag>
                                        ))}
                                    </div>
                                ) : t("food.management.card.noCategories")}
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                                    <Space wrap>
                                        <Button type="primary" style={{ maxWidth: "15vw" }} onClick={() => handleOptions(food.id)}>
                                            {t("food.management.buttons.options")}
                                        </Button>
                                        <Button style={{ maxWidth: "15vw" }} onClick={() => handleEdit(food)}>
                                            {t("food.management.buttons.edit")}
                                        </Button>
                                        <Popconfirm
                                            title={t("food.management.popconfirm.deleteTitle")}
                                            onConfirm={() => handleDelete(food.id)}
                                            okText={t("food.management.popconfirm.okText")}
                                            cancelText={t("food.management.popconfirm.cancelText")}
                                        >
                                            <Button danger style={{ maxWidth: "15vw" }}>
                                                {t("food.management.buttons.delete")}
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
