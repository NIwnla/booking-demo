import { ArrowLeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Col, Image, Row, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import FoodCard from '../../components/cards/foodMenu/FoodCard';
import MenuNavBar from '../../components/navbars/foodMenu/MenuNavBar';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { routeNames } from '../../constaints/routeName';
import { getLocalizedText } from '../../helpers/getLocalizedText';
import axiosInstance from '../../service/axios';
import RightInformationSection from './components/RightInformationSection';
import './ScrollableCategories.css';
import { Helmet } from 'react-helmet-async';

const { Title } = Typography;

const DetailedMenuPage = () => {
    const { t, i18n } = useTranslation('global');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get('categoryId');
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [foods, setFoods] = useState([]);
    const [loadingFoods, setLoadingFoods] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();
    const isLargeScreen = useMediaQuery({ minWidth: 992 });


    useEffect(() => {
        fetchCategories();
        fetchFoods();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            fetchFoods();
        }
    }, [selectedCategory]);

    const fetchFoods = async () => {
        setLoadingFoods(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.FOOD.GET_ALL, {
                params: { categories: selectedCategory ? selectedCategory.id : categoryId },
            });
            setFoods(response.data.items);
        } catch (error) {
            console.error("Failed to fetch foods", error);
        } finally {
            setLoadingFoods(false);
        }
    };

    const fetchCategories = async () => {
        setLoadingCategories(true);
        const pageSize = 100;
        try {
            const response = await axiosInstance.get(apiEndPoints.CATEGORY.GET_ALL, {
                params: { pageSize },
            });
            setCategories(response.data.items);
            const initialCategory = response.data.items.find(category => category.id === categoryId);
            if (initialCategory) {
                setSelectedCategory(initialCategory);
            } else {
                setSelectedCategory(response.data.items[0] || null);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoadingCategories(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>{selectedCategory ? `${getLocalizedText(selectedCategory, 'name', i18n.language)} - Menu` : 'Category Menu'} - Nollowa Chicken</title>
                <meta name="description" content="Explore our menu categories and find your favorite dishes" />
            </Helmet>
            <div>
                <MenuNavBar />
                <div style={{ padding: isLargeScreen ? '5vh 10vw' : '10px 2vw' }}>
                    <Row style={{ position: "relative" }}>
                        <Col xs={24} lg={18} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ position: "absolute", left: 0, zIndex: 100 }}>
                                {isLargeScreen ? (
                                    <Breadcrumb
                                        items={[
                                            {
                                                title: <Title level={5}><a href={routeNames.foodMenu.main}>{t("foodMenu.detailedMenuPage.home")}</a></Title>,
                                            },
                                            selectedCategory && {
                                                title: <Title level={5}>{getLocalizedText(selectedCategory, 'name', i18n.language)}</Title>,
                                            },
                                        ].filter(Boolean)}
                                    />
                                ) : (
                                    <ArrowLeftOutlined
                                        onClick={() => navigate(-1)}
                                        style={{
                                            fontSize: '20px',
                                            cursor: 'pointer',
                                            padding: '10px',
                                        }}
                                    />
                                )}
                            </div>
                            <Title style={{ fontSize: '1.5rem', flex: 1, textAlign: 'center' }}>{t("foodMenu.detailedMenuPage.menu")}</Title>
                        </Col>
                    </Row>

                    <Row gutter={[24, 16]}>
                        <Col xs={24} lg={18}>
                            {/* Category Grid */}
                            <div>
                                <Spin spinning={loadingCategories}>
                                    <div className="scroll-container">
                                        <Row gutter={16} wrap={false} style={{ margin: ' 4px', width: '100vw' }}>
                                            {categories.map((category) => (
                                                <Col key={category.id} xs={10} sm={5} md={4} lg={5} xl={4} xxl={3}>
                                                    <Card
                                                        hoverable
                                                        onClick={() => setSelectedCategory(category)}
                                                        style={{
                                                            height: '175px',
                                                            boxShadow: selectedCategory?.id === category.id ? '0 4px 8px red' : '0 4px 8px rgba(0, 0, 0, 0.2)'
                                                        }}
                                                        styles={{ body: { padding: '10px' } }}
                                                        cover={
                                                            <Image
                                                                preview={false}
                                                                alt={getLocalizedText(category, 'name', i18n.language)}
                                                                src={`${AxiosConstants.AXIOS_BASEURL}/${category.imagePath}`}
                                                                style={{ height: "100px", objectFit: "cover", borderRadius: "10px 10px 0 0" }}
                                                            />
                                                        }
                                                    >
                                                        <Title level={5} style={{ fontSize: '0.875rem', textAlign: 'center' }}>
                                                            {getLocalizedText(category, 'name', i18n.language)}
                                                        </Title>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                </Spin>
                            </div>
                            {/* Food Grid */}
                            <div style={{ marginTop: '20px' }}>
                                <Title level={3} style={{ textAlign: 'start' }}>{t("foodMenu.detailedMenuPage.foods")}</Title>
                                <Spin spinning={loadingFoods}>
                                    <Row gutter={[16, 16]} justify="start">
                                        {foods.map((food) => (
                                            <Col key={food.id} xs={24} sm={12} md={8} xl={8}>
                                                <FoodCard
                                                    food={food}
                                                    onClick={() => navigate(`${routeNames.foodMenu.detailed.fromMenu}${food.id}?categoryId=${categoryId}`)}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </Spin>
                            </div>
                        </Col>
                        {isLargeScreen &&
                            <Col span={6}>
                                {/* Information Section */}
                                <div>
                                    <RightInformationSection />
                                </div>
                            </Col>
                        }
                    </Row>
                </div>
            </div>
        </>
    );
};

export default DetailedMenuPage;
