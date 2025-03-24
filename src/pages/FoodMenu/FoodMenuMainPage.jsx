import { Button, Card, Carousel, Col, DatePicker, Image, Row, Spin, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import FoodCard from '../../components/cards/foodMenu/FoodCard';
import LocationPickerModal from './components/LocationPickerModal';
import MenuNavBar from '../../components/navbars/foodMenu/MenuNavBar';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { routeNames } from '../../constaints/routeName';
import { DeliveryContext } from '../../context/DeliveryContext';
import { getLocalizedText } from '../../helpers/getLocalizedText';
import axiosInstance from '../../service/axios';
import './ScrollableCategories.css';

const { Title, Paragraph } = Typography;

const ImageCarousel = () => {
    return (
        <div style={{ backgroundColor: '#000000', padding: '10px', textAlign: 'center', borderRadius: '10px', minHeight: "30vh" }}>
            <Carousel autoplay arrows infinite>
                <img src={'/images/image1.jpg'} alt={'Slide 1'} />
                <img src={'/images/image2.jpg'} alt={'Slide 2'} />
                <img src={'/images/image3.jpg'} alt={'Slide 3'} />
            </Carousel>
        </div>
    );
};

const FoodMenuMainPage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('global');
    const { location, deliveryTime, setDeliveryTime } = useContext(DeliveryContext);
    const [categories, setCategories] = useState([]);
    const [foods, setFoods] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingFoods, setLoadingFoods] = useState(false);
    const [fadeInFood, setFadeInFood] = useState(false);
    const [fadeInCategories, setFadeInCategories] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchFoods();
    }, []);

    const fetchCategories = async () => {
        setLoadingCategories(true);
        const pageSize = 100;
        try {
            const response = await axiosInstance.get(apiEndPoints.CATEGORY.GET_ALL, {
                params: { pageSize },
            });
            setCategories(response.data.items);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoadingCategories(false);
            setTimeout(() => setFadeInCategories(true), 100);
        }
    };

    const fetchFoods = async () => {
        setLoadingFoods(true);
        const pageSize = 8;
        try {
            const response = await axiosInstance.get(apiEndPoints.FOOD.GET_ALL, {
                params: { pageSize },
            });
            setFoods(response.data.items);
        } catch (error) {
            console.error("Failed to fetch foods", error);
        } finally {
            setLoadingFoods(false);
            setTimeout(() => setFadeInFood(true), 100);
        }
    };


    return (
        <>
            <Helmet>
                <title>Menu - Nollowa Chicken</title>
                <meta name="description" content="Browse our delicious menu of Korean fried chicken and sides" />
            </Helmet>
            <div>
                <MenuNavBar />
                <div style={{ padding: '5vh 10vw' }}>
                    <Row gutter={[24, 24]} style={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
                        {/* Carousel Section */}
                        <Col xs={24} md={18} style={{ display: 'flex', alignItems: 'stretch' }}>
                            <div style={{ width: '100%', height: '100%', backgroundColor: '#000000', borderRadius: '20px', padding: '20px' }}>
                                <ImageCarousel />
                            </div>
                        </Col>

                        {/* Info Section */}
                        <Col xs={24} md={6}
                            style={{
                                padding: '20px',
                                backgroundColor: 'white',
                                opacity: fadeInCategories ? 1 : 0,
                                transition: 'opacity 0.5s ease-out',
                                borderRadius: '20px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                            }}>
                            <Title style={{ fontSize: '1rem' }}>{t("foodMenu.mainPage.deliveryInformationTitle")}</Title>
                            <Button
                                onClick={() => setIsLocationModalOpen(true)}
                                type="primary"
                                style={{
                                    width: '100%',
                                    marginBottom: '10px',
                                    height: 'auto',
                                    padding: '4px 15px'
                                }}
                            >
                                <Typography.Text
                                    ellipsis={{ tooltip: true }}
                                    style={{ color: 'white', width: '100%', display: 'block' }}
                                >
                                    {location ? location.formattedAddress : t("foodMenu.mainPage.selectLocation")}
                                </Typography.Text>
                            </Button>

                            <DatePicker
                                showTime={{
                                    format: 'HH:mm',
                                    minuteStep: 15,
                                }}
                                format="DD/MM/YYYY HH:mm"
                                value={deliveryTime ? dayjs(deliveryTime) : null}
                                onChange={(datetime) => setDeliveryTime(datetime ? datetime.toISOString() : null)}
                                style={{
                                    width: '100%',
                                    marginBottom: '10px'
                                }}
                                placeholder={t("foodMenu.mainPage.selectDeliveryTime")}
                                disabledDate={(current) => {
                                    return current && current < dayjs().startOf('day');
                                }}
                                disabledTime={(current) => {
                                    const now = dayjs();
                                    const minTime = now.add(30, 'minute');

                                    if (current && current.isSame(now, 'day')) {
                                        return {
                                            disabledHours: () => Array.from({ length: 24 }, (_, i) => i)
                                                .filter(hour => hour < minTime.hour()),
                                            disabledMinutes: (selectedHour) => {
                                                if (selectedHour === minTime.hour()) {
                                                    return Array.from({ length: 60 }, (_, i) => i)
                                                        .filter(minute => minute < minTime.minute());
                                                }
                                                return [];
                                            }
                                        };
                                    }
                                    return {};
                                }}
                            />

                            <Paragraph style={{ fontSize: '0.875rem' }}>
                                {t("foodMenu.mainPage.deliveryDescription")}
                            </Paragraph>
                            <Paragraph style={{ fontSize: '0.875rem' }}>{t("foodMenu.mainPage.deliveryBenefits")}</Paragraph>
                        </Col>
                    </Row>

                    {/* Category Grid */}
                    <div style={{ marginTop: '20px' }}>
                        <Title level={3} style={{ textAlign: 'start' }}>{t("foodMenu.mainPage.categories")}</Title>
                        <Spin spinning={loadingCategories}>
                            <div
                                className="scroll-container"
                                style={{
                                    opacity: fadeInCategories ? 1 : 0,
                                    transition: 'opacity 0.5s ease-out',
                                }}>
                                <Row gutter={20} wrap={false} style={{ margin: ' 4px', width: '100vw' }}>
                                    {categories.map((category) => (
                                        <Col key={category.id} xs={10} md={8} lg={5} xl={4} xxl={3}>
                                            <Card
                                                onClick={() => navigate(`${routeNames.foodMenu.menu}?categoryId=${category.id}`)}
                                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px red'}
                                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'}
                                                style={{ height: '175px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', transition: 'box-shadow 0.3s ease-out' }}
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

                    {/* Available Foods Grid */}
                    <div style={{ marginTop: '40px' }}>
                        <Title level={3} style={{ textAlign: 'start' }}>{t("foodMenu.mainPage.popularFoods")}</Title>
                        <Spin spinning={loadingFoods}>
                            <Row
                                gutter={[16, 16]}
                                justify="start"
                                style={{
                                    opacity: fadeInFood ? 1 : 0,
                                    transition: 'opacity 0.5s ease-out',
                                }}>
                                {foods.map((food) => (
                                    <Col key={food.id} xs={24} sm={12} md={12} lg={6} >
                                        <FoodCard food={food} />
                                    </Col>
                                ))}
                            </Row>
                        </Spin>
                    </div>
                </div>

                <LocationPickerModal
                    isOpen={isLocationModalOpen}
                    onClose={() => setIsLocationModalOpen(false)}
                />
            </div>
        </>
    );
};

export default FoodMenuMainPage;
