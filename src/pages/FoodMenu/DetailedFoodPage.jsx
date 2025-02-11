import React, { useEffect } from 'react';
import { Row, Col, Breadcrumb, Typography, Image } from 'antd';
import { useParams } from 'react-router-dom';
import { routeNames } from '../../constaints/routeName';
import { useState } from 'react';
import axiosInstance from '../../service/axios';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { getLocalizedText } from '../../helpers/getLocalizedText';
import { useTranslation } from 'react-i18next';
import RightInformationSection from './RightInformationSection';
const { Title } = Typography;

const DetailedFoodPage = ({ breadcrumb = null }) => {
    const { id } = useParams();
    const { t, i18n } = useTranslation('global');
    const [food, setFood] = useState(null);

    useEffect(() => {
        fetchFoodDetails();
    }, [id]);

    const fetchFoodDetails = async () => {
        try {
            const response = await axiosInstance.get(apiEndPoints.FOOD.GET_BY_ID(id));
            setFood(response.data);
        } catch (error) {
            console.error('Failed to fetch food details:', error);
        }
    };

    const FoodDetails = () => {
        if (!food) return null;

        return (
            <>
                <Title style={{ fontSize: '1vw', marginBottom: '2vh' }}>
                    Description
                </Title>
                <Typography style={{ fontSize: '1vw' }}>
                    {food.descriptionEN}
                </Typography>
                <Typography style={{ fontSize: '1vw' }}>
                    Price: {food.basePrice}VND
                </Typography>
            </>
        );
    };


    const breadcrumbItems = [
        {
            title: <Title level={5}><a href={routeNames.foodMenu.main}>Home</a></Title>,
        },
        breadcrumb && {
            title: <Title level={5}><a href={routeNames.foodMenu.main}>{breadcrumb}</a></Title>,
        },
        food && {
            title: <Title level={5}>{getLocalizedText(food, 'name', i18n.language)}</Title>,
        },
    ].filter(Boolean);

    return (
        <div style={{padding: '0 9vw'}}>
            <Breadcrumb style={{ marginBottom: '1vh' }} items={breadcrumbItems} />
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <div style={{ padding: '20px' }}>
                        {food && (
                            <>
                                <Title style={{ fontSize: '1.5vw', marginBottom: '5vh' }}>
                                    {getLocalizedText(food, 'name', i18n.language)}
                                </Title>
                                <div style={{ textAlign: 'center' }}>
                                    <Image
                                        preview={false}
                                        src={`${AxiosConstants.AXIOS_BASEURL}/${food.imagePath}`}
                                        alt={getLocalizedText(food, 'name', i18n.language)}
                                        style={{ height: '30vh', borderRadius: '50%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)', marginBottom: '5vh' }} />
                                </div>
                                {food.options && food.options.length > 0 && <FoodDetails/>}
                            </>
                        )}
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{ padding: '20px' }}>
                        {food.options && food.options.length === 0 && <FoodDetails />}
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{ padding: '20px' }}>
                        <RightInformationSection/>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default DetailedFoodPage;