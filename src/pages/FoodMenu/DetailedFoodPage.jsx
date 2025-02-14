import { Breadcrumb, Checkbox, Col, Image, Row, Spin, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { routeNames } from '../../constaints/routeName';
import { getLocalizedText } from '../../helpers/getLocalizedText';
import axiosInstance from '../../service/axios';
import RightInformationSection from './RightInformationSection';
import MenuNavBar from '../../components/navbars/foodMenu/MenuNavBar';
import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { DeliveryContext } from '../../context/DeliveryContext';
const { Title } = Typography;

const DetailedFoodPage = ({ breadcrumb = null }) => {
    const { id } = useParams();
    const { t, i18n } = useTranslation('global');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get('categoryId');
    const { addToCart } = useContext(DeliveryContext);
    const [food, setFood] = useState(null);
    const [isLoadingFood, setIsLoadingFood] = useState(null);
    const [fadeIn, setFadeIn] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        fetchFoodDetails();
    }, [id]);

    const fetchFoodDetails = async () => {
        setIsLoadingFood(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.FOOD.GET_BY_ID(id));
            setFood(response.data);
        } catch (error) {
            console.error('Failed to fetch food details:', error);
        } finally {
            setIsLoadingFood(false);
            setTimeout(() => setFadeIn(true), 100);
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
                    {getLocalizedText(food, 'description', i18n.language)}
                </Typography>
                <Typography style={{ fontSize: '1vw' }}>
                    Price: {food?.basePrice}VND
                </Typography>
            </>
        );
    };


    const breadcrumbItems = [
        {
            title: <Title level={5}><a href={routeNames.foodMenu.main}>Home</a></Title>,
        },
        breadcrumb && {
            title: <Title level={5}><a href={`${routeNames.foodMenu.menu}?categoryId=${categoryId}`}>{breadcrumb}</a></Title>,
        },
        food && {
            title: <Title level={5}>{getLocalizedText(food, 'name', i18n.language)}</Title>,
        },
    ].filter(Boolean);



    const handleOptionClick = (optionId) => {
        setSelectedOptions((prevSelected) => {
            if (prevSelected.includes(optionId)) {
                return prevSelected.filter((id) => id !== optionId);
            } else {
                return [...prevSelected, optionId];
            }
        });
    };

    const handleAddToCart = () => {
        if (!food) return;

        const updatedFood = {
            ...food,
            options: food.options.filter(opt => selectedOptions.includes(opt.id))
        };

        addToCart(updatedFood);
    };


    return (
        <div>
            <MenuNavBar />
            <Spin spinning={isLoadingFood}>
                <div
                    style={{
                        padding: '5vh 10vw',
                    }}>
                    <Breadcrumb style={{ marginBottom: '1vh' }} items={breadcrumbItems} />
                    <Row
                        gutter={[16, 16]}
                        style={{
                            opacity: fadeIn ? 1 : 0,
                            transition: 'opacity 0.5s ease-out'
                        }}>
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
                                                src={`${AxiosConstants.AXIOS_BASEURL}/${food?.imagePath}`}
                                                alt={getLocalizedText(food, 'name', i18n.language)}
                                                style={{ height: '20vw', width: '20vw', borderRadius: '50%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)', marginBottom: '5vh' }} />
                                        </div>
                                        {food?.options && food?.options.length > 0 && <FoodDetails />}
                                    </>
                                )}
                            </div>
                        </Col>
                        <Col span={8}>
                            <div style={{ padding: '20px' }}>
                                {food?.options && food?.options.length === 0 && <FoodDetails />}
                                {food?.options && food?.options.length > 0 && (
                                    <div>
                                        <Title style={{ fontSize: '1.5vw', marginBottom: '2vh' }}>
                                            Options
                                        </Title>
                                        {food?.options.map(option => (
                                            <Row
                                                key={option.id}
                                                align="middle"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "flex-start",
                                                    alignItems: "center",
                                                    padding: "1.5vh 1vw",
                                                    cursor: "pointer",
                                                    transition: "background-color 0.3s ease",
                                                    backgroundColor: selectedOptions.includes(option.id) ? "white" : "transparent",
                                                }}
                                                onClick={() => handleOptionClick(option.id)}
                                            >
                                                {/* Left Side: Checkbox & Image */}
                                                <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
                                                    <Checkbox
                                                        checked={selectedOptions.includes(option.id)}
                                                        style={{ transform: "scale(1.3)" }}
                                                    />
                                                    <Image
                                                        preview={false}
                                                        src={`${AxiosConstants.AXIOS_BASEURL}/${option.imagePath}`}
                                                        alt={getLocalizedText(option, "name", i18n.language)}
                                                        style={{ height: "4vw", width: "4vw" }}
                                                    />
                                                </div>

                                                {/* Right Side: Text Content */}
                                                <div style={{ flex: 1, textAlign: "left", marginLeft: '1.5vw', minWidth: "10vw", maxWidth: "20vw" }}>
                                                    <Title
                                                        level={5}
                                                        style={{
                                                            fontSize: "1vw",
                                                            wordWrap: "break-word", // Break words if too long
                                                            whiteSpace: "normal", // Allow text to wrap into new lines
                                                            maxWidth: "100%", // Keep it from expanding too much
                                                        }}
                                                    >
                                                        {getLocalizedText(option, "name", i18n.language)}
                                                    </Title>
                                                    <Typography
                                                        style={{
                                                            fontSize: "0.8vw",
                                                            wordWrap: "break-word", // Break words if necessary
                                                            whiteSpace: "normal", // Allow wrapping
                                                            maxWidth: "10vw", // Restrict excessive expansion
                                                        }}
                                                    >
                                                        + {option.price} VND
                                                    </Typography>
                                                </div>
                                            </Row>

                                        ))}
                                    </div>
                                )}

                                {/* Total Price & Add to Cart Button */}
                                <div
                                    style={{
                                        backgroundColor: '#d32f2f',
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "1vh 1vw",
                                        marginTop: "2vh",
                                        borderRadius: "2vw",
                                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                                        cursor: 'pointer',
                                        transition: "background 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e64a4a"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#d32f2f"}
                                    onClick={handleAddToCart}
                                >
                                    <Title level={4} style={{ fontSize: "1vw", margin: 0, color: 'white' }}>
                                        {(food?.basePrice + selectedOptions.reduce((sum, optionId) => {
                                            const selectedOption = food?.options.find(opt => opt.id === optionId);
                                            return sum + (selectedOption ? selectedOption.price : 0);
                                        }, 0)).toLocaleString()} VND
                                    </Title>
                                    <Typography
                                        style={{
                                            fontSize: "1vw",
                                            color: 'white',
                                            paddingRight: '0.1vw',
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5vw",
                                        }}>
                                        Add to Cart <PlusCircleOutlined style={{ fontSize: "2vw" }} />
                                    </Typography>
                                </div>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div style={{ padding: '20px' }}>
                                <RightInformationSection />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Spin>
        </div>
    );
};

export default DetailedFoodPage;