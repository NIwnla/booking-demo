import { Breadcrumb, Card, Col, Image, Row, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { routeNames } from '../../constaints/routeName';
import { getLocalizedText } from '../../helpers/getLocalizedText';
import axiosInstance from '../../service/axios';
import RightInformationSection from './RightInformationSection';
import './ScrollableCategories.css';
const { Title, Paragraph } = Typography;


const DetailedMenuPage = () => {
    const { i18n } = useTranslation('global');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get('categoryId');
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [foods, setFoods] = useState([]);
    const [loadingFoods, setLoadingFoods] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

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
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoadingCategories(false);
        }
    };

    return (
        <div style={{ padding: '0 10vw' }}>
            <Breadcrumb
                items={[
                    {
                        title: <Title level={5}><a href={routeNames.foodMenu.main}>Home</a></Title>,
                    },
                    selectedCategory && {
                        title: <Title level={5}>{getLocalizedText(selectedCategory, 'name', i18n.language)}</Title>,
                    },
                ].filter(Boolean)}
            />
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={18}>
                    {/* Category Grid */}
                    <div style={{ marginTop: '20px' }}>
                        <Spin spinning={loadingCategories}>
                            <div className="scroll-container">
                                <Row gutter={16} wrap={false} style={{ margin: ' 4px' }}>
                                    {categories.map((category) => (
                                        <Col key={category.id} md={12} lg={5} xl={5} xxl={3}>
                                            <Card
                                                hoverable
                                                onClick={() => setSelectedCategory(category)}
                                                style={{
                                                    height: '175px',
                                                    boxShadow: selectedCategory.id === category.id ? '0 4px 8px red' : '0 4px 8px rgba(0, 0, 0, 0.2)'
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
                                                <Title level={5} style={{ fontSize: '0.75vw', textAlign: 'center' }}>
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
                        <Title level={3} style={{ textAlign: 'start' }}>Foods</Title>
                        <Spin spinning={loadingFoods}>
                            <Row gutter={[16, 16]} justify="start" >
                                {foods.map((food) => (
                                    <Col key={food.id} xs={12} sm={12} md={12} xl={8} >
                                        <Card
                                            hoverable
                                            onClick={() => navigate(`${routeNames.foodMenu.detailed.fromMenu}${food.id}`)}
                                            cover={
                                                <Image
                                                    preview={false}
                                                    alt={getLocalizedText(food, 'name', i18n.language)}
                                                    src={`${AxiosConstants.AXIOS_BASEURL}/${food.imagePath}`}
                                                    style={{ height: '30vh', objectFit: 'cover', borderRadius: '10px 10px 0 0', padding: '20px 10px 10px 10px' }}
                                                />
                                            }
                                            style={{
                                                textAlign: 'center',
                                                borderRadius: '10px',
                                            }}
                                            styles={{ body: { padding: '20px' } }}
                                        >
                                            <Title level={5} style={{ marginBottom: 0 }}>{getLocalizedText(food, 'name', i18n.language)}</Title>
                                            <Paragraph style={{ fontWeight: 'bold', color: 'red' }}>
                                                {food.basePrice}VND
                                            </Paragraph>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Spin>
                    </div>
                </Col >
                <Col xs={24} lg={6}>
                    {/* Information Section */}
                    <div style={{ marginTop: '20px' }}>
                        <RightInformationSection />
                    </div>
                </Col>
            </Row >
        </div >
    );
};

export default DetailedMenuPage;