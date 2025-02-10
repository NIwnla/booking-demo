import { Carousel, Col, Row, Typography, Spin, Card, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../service/axios';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { getLocalizedText } from '../../helpers/getLocalizedText';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

const ImageCarousel = () => {
    return (
        <div style={{ backgroundColor: '#000000', padding: '10px', textAlign: 'center', borderRadius: '10px' }}>
            <Carousel autoplay arrows infinite>
                <img src={'/images/image1.jpg'} alt={'Slide 1'} />
                <img src={'/images/image2.jpg'} alt={'Slide 2'} />
                <img src={'/images/image3.jpg'} alt={'Slide 3'} />
            </Carousel>
        </div>
    );
};

const FoodMenuMainPage = () => {
    const {i18n} = useTranslation('global');
    const [categories, setCategories] = useState([]);
    const [foods, setFoods] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingFoods, setLoadingFoods] = useState(false);

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
        }
    };

    const fetchFoods = async () => {
        setLoadingFoods(true);
        const pageSize = 8; // Limit to 10 foods for display
        try {
            const response = await axiosInstance.get(apiEndPoints.FOOD.GET_ALL, {
                params: { pageSize },
            });
            setFoods(response.data.items);
        } catch (error) {
            console.error("Failed to fetch foods", error);
        } finally {
            setLoadingFoods(false);
        }
    };

    return (
        <div style={{ padding: '1vh 10vw' }}>
            <Row gutter={24} style={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
                {/* Carousel Section */}
                <Col xs={24} md={18} style={{ display: 'flex', alignItems: 'stretch' }}>
                    <div style={{ width: '100%', height: '100%' }}>
                        <ImageCarousel />
                    </div>
                </Col>

                {/* Info Section */}
                <Col xs={24} md={6} style={{ padding: '20px', backgroundColor: 'white' }}>
                    <Title level={3}>Delivery Information</Title>
                    <Paragraph>
                        Welcome to our delivery service. Enjoy fresh and delicious meals delivered to your doorstep.
                    </Paragraph>
                    <Paragraph>Fast, reliable, and convenient.</Paragraph>
                </Col>
            </Row>

            {/* Category Grid */}
            <div style={{ marginTop: '20px' }}>
                <Title level={3} style={{ textAlign: 'start' }}>Categories</Title>
                <Spin spinning={loadingCategories}>
                    <Row gutter={[16, 16]} justify="start">
                        {categories.map((category) => (
                            <Col key={category.id} xs={12} sm={8} md={6} lg={3}>
                                <Card
                                    hoverable
                                    cover={
                                        <Image
                                            preview={false}
                                            alt={category.name}
                                            src={`${AxiosConstants.AXIOS_BASEURL}/${category.imagePath}`}
                                            style={{ height: '120px', objectFit: 'cover', borderRadius: '10px 10px 0 0' }}
                                        />
                                    }
                                    style={{ textAlign: 'center', borderRadius: '10px', height: '225px' }}
                                >
                                    <Title level={5}>{getLocalizedText(category, 'name', i18n.language)}</Title>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Spin>
            </div>

            {/* Available Foods Grid */}
            <div style={{ marginTop: '40px' }}>
                <Title level={3} style={{ textAlign: 'start' }}>Popular</Title>
                <Spin spinning={loadingFoods}>
                    <Row gutter={[16, 16]} justify="start">
                        {foods.map((food) => (
                            <Col key={food.id} xs={12} sm={12} md={12} lg={6} >
                                <Card
                                    hoverable
                                    cover={
                                        <Image
                                            preview={false}
                                            alt={food.name}
                                            src={`${AxiosConstants.AXIOS_BASEURL}/${food.imagePath}`}
                                            style={{ height: '30vh', objectFit: 'cover', borderRadius: '10px 10px 0 0', padding:'20px 10px 10px 10px' }}
                                        />
                                    }
                                    style={{ textAlign: 'center', borderRadius: '10px' }}
                                >
                                    <Title level={5} style={{ marginBottom: 0 }}>{food.name}</Title>
                                    <Paragraph style={{ fontWeight: 'bold', color: 'red' }}>
                                        {food.basePrice}đ
                                    </Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Spin>
            </div>
        </div>
    );
};

export default FoodMenuMainPage;
