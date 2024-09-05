import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Popconfirm, message, Image, Spin } from "antd";
import axiosInstance from "../../service/axios";
import { useParams } from "react-router-dom";
import { AxiosConstants } from "../../constaints/axiosContaint";
import { apiEndPoints } from "../../constaints/apiEndPoint";
import CreateFoodOptionModal from "../../components/modals/CreateFoodOptionModal";
import EditFoodOptionModal from "../../components/modals/EditFoodOptionModal";

const FoodOptionPageAdmin = () => {
    const { id } = useParams();
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);

    useEffect(() => {
        fetchOptions();
    }, [id]);

    const fetchOptions = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.FOOD.GET_BY_ID(id));
            setFood(response.data);
        } catch (error) {
            message.error("Failed to fetch food options.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditOption = (option) => {
        setSelectedOption(option);
        setEditModalVisible(true);
    };

    const handleDeleteOption = async (optionId) => {
        try {
            await axiosInstance.delete(apiEndPoints.FOOD_OPTION.DELETE(optionId));
            message.success('Option deleted successfully.');
            fetchOptions(); // Refresh the list after deletion
        } catch (error) {
            message.error('Failed to delete option.');
        }
    };

    const handleOptionCreated = () => {
        fetchOptions();
    };


    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <h2>{food?.name} Options</h2>
                <Button type="primary" onClick={() => setCreateModalVisible(true)}>
                    Create Option
                </Button>
            </div>
            <Spin spinning={loading} size="large">
                <Row gutter={[16, 16]}>
                    {food?.options.map((option) => (
                        <Col key={option.id} xs={24} sm={12} md={8} lg={8}>
                            <Card
                                hoverable
                                cover={
                                    <div style={{ overflow: "hidden", height: "150px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Image
                                            alt={option.name}
                                            src={`${AxiosConstants.AXIOS_BASEURL}/${option.imagePath}`}
                                            style={{ width: "100%", height: "auto", maxHeight: "150px" }}
                                        />
                                    </div>
                                }
                            >
                                <Card.Meta title={option.name} description={`Additional Price: ${option.additionalPrice}`} />
                                <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
                                    <Button type="primary" onClick={() => handleEditOption(option)}>
                                        Edit
                                    </Button>
                                    <Popconfirm
                                        title="Are you sure you want to delete this option?"
                                        onConfirm={() => handleDeleteOption(option.id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button danger style={{ marginLeft: 8 }}>
                                            Delete
                                        </Button>
                                    </Popconfirm>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Spin>
            <CreateFoodOptionModal
                visible={createModalVisible}
                foodId={id}
                onClose={() => setCreateModalVisible(false)}
                onOptionCreated={handleOptionCreated}
            />
            {editModalVisible && (
                <EditFoodOptionModal
                    visible={editModalVisible}
                    onClose={() => setEditModalVisible(false)}
                    foodId={id}
                    option={selectedOption}
                    onOptionUpdated={fetchOptions} // Callback to refresh the options list
                />
            )}
        </div>
    );
};

export default FoodOptionPageAdmin;