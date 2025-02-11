import { App, Button, Card, Col, Image, Popconfirm, Row, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import CreateFoodOptionModal from "../../components/modals/foodOption/CreateFoodOptionModal";
import EditFoodOptionModal from "../../components/modals/foodOption/EditFoodOptionModal";
import { apiEndPoints } from "../../constaints/apiEndPoint";
import { AxiosConstants } from "../../constaints/axiosContaint";
import axiosInstance from "../../service/axios";
import './FoodOptionPageAdmin.css';
import { useTranslation } from "react-i18next";
import { getLocalizedText } from "../../helpers/getLocalizedText";

const { Title } = Typography;
const FoodOptionPageAdmin = () => {
    const { t, i18n } = useTranslation('global');
    const { id } = useParams();
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const { message } = App.useApp();

    const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });

    useEffect(() => {
        fetchOptions();
    }, [id]);

    const fetchOptions = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.FOOD.GET_BY_ID(id));
            setFood(response.data);
        } catch (error) {
            message.error(t('foodOption.management.messages.fetchError'));
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
            message.success(t('foodOption.management.messages.deleteSuccess'));
            fetchOptions(); // Refresh the list after deletion
        } catch (error) {
            message.error(t('foodOption.management.messages.deleteError'));
        }
    };

    const handleOptionCreated = () => {
        fetchOptions();
    };

    return (
        <div
            style={{
                padding: isSmallScreen ? "12px" : "24px", // Smaller padding for small screens
            }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: isSmallScreen ? "column" : "row", // Change direction based on screen size
                    justifyContent: "space-between",
                    marginBottom: 24,
                    alignItems: isSmallScreen ? "flex-start" : "center", // Align left on small screens, center on large screens
                    gap: isSmallScreen ? "16px" : "0", // Add some gap on small screens
                }}
            >
                <Title level={3}>{t('foodOption.management.titles.pageTitle')}</Title>
                <Button type="primary" onClick={() => setCreateModalVisible(true)}>
                    {t('foodOption.management.buttons.createOption')}
                </Button>
            </div>
            <Spin spinning={loading} size="large" tip={t('foodOption.management.messages.loading')}>
                <Row gutter={[16, 16]}>
                    {food?.options.map((option) => (
                        <Col key={option.id} xs={24} sm={12} md={8} lg={8}>
                            <Card
                                hoverable
                                cover={
                                    <div style={{ overflow: "hidden", height: "150px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Image
                                            alt={getLocalizedText(option, 'name', i18n.language)}
                                            src={`${AxiosConstants.AXIOS_BASEURL}/${option.imagePath}`}
                                            style={{ width: "100%", height: "auto", maxHeight: "150px" }}
                                        />
                                    </div>
                                }
                            >
                                <Card.Meta title={getLocalizedText(option, 'name', i18n.language)} description={`${t('foodOption.management.columns.price')}: ${option.price}`} />
                                <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: '8px' }}>
                                    <Button type="primary" onClick={() => handleEditOption(option)}>
                                        {t('foodOption.management.buttons.edit')}
                                    </Button>
                                    <Popconfirm
                                        title={t('foodOption.management.popconfirm.deleteTitle')}
                                        onConfirm={() => handleDeleteOption(option.id)}
                                        okText={t('foodOption.management.popconfirm.okText')}
                                        cancelText={t('foodOption.management.popconfirm.cancelText')}
                                    >
                                        <Button danger>
                                            {t('foodOption.management.buttons.delete')}
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
