import { ArrowLeftOutlined, PlusCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Breadcrumb, Checkbox, Image, Spin, Typography, Space, Badge } from 'antd';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { routeNames } from '../../constaints/routeName';
import { getLocalizedText } from '../../helpers/getLocalizedText';
import { DeliveryContext } from '../../context/DeliveryContext';

const { Title, Text } = Typography;

const MobileDetailedFoodPage = ({ food, isLoadingFood, selectedOptions, handleOptionClick, handleAddToCart, t, i18n, breadcrumbItems }) => {
    const navigate = useNavigate();
    const { cart } = useContext(DeliveryContext);
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);


    if (!food) return <Spin spinning={isLoadingFood} />;

    return (
        <div style={{ paddingBottom: '80px', minHeight: '100vh' }}>

            {/* Main Content */}
            <div style={{ padding: '0 20px' }}>
                {/* Food Image */}
                <div style={{ textAlign: 'center', marginBottom: '20px', paddingTop: '20px' }}>
                    <Image
                        preview={false}
                        src={`${AxiosConstants.AXIOS_BASEURL}/${food?.imagePath}`}
                        alt={getLocalizedText(food, 'name', i18n.language)}
                        style={{ width: '100%', maxWidth: '300px', borderRadius: '15px' }}
                    />
                </div>

                {/* Food Name and Description */}
                <Title level={3} style={{ marginBottom: '15px' }}>
                    {getLocalizedText(food, 'name', i18n.language)}
                </Title>
                <Text style={{ display: 'block', marginBottom: '20px' }}>
                    {getLocalizedText(food, 'description', i18n.language)}
                </Text>
                <Text strong style={{ display: 'block', marginBottom: '20px' }}>
                    {t('foodMenu.detailedFoodPage.price')}: {food?.basePrice.toLocaleString()} VND
                </Text>

                {/* Options Section */}
                {food?.options && food.options.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <Title level={4} style={{ marginBottom: '15px' }}>
                            {t('foodMenu.detailedFoodPage.options')}
                        </Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {food.options.map(option => (
                                <div
                                    key={option.id}
                                    onClick={() => handleOptionClick(option.id)}
                                    style={{
                                        padding: '10px',
                                        backgroundColor: selectedOptions.includes(option.id) ? '#f5f5f5' : 'transparent',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Space align="center">
                                        <Checkbox checked={selectedOptions.includes(option.id)} />
                                        <Image
                                            preview={false}
                                            src={`${AxiosConstants.AXIOS_BASEURL}/${option.imagePath}`}
                                            alt={getLocalizedText(option, "name", i18n.language)}
                                            style={{ width: '50px', height: '50px', borderRadius: '8px' }}
                                        />
                                        <div>
                                            <Text strong>{getLocalizedText(option, "name", i18n.language)}</Text>
                                            <Text style={{ display: 'block' }}>+ {option.price.toLocaleString()} VND</Text>
                                        </div>
                                    </Space>
                                </div>
                            ))}
                        </Space>
                    </div>
                )}
            </div>

            {/* Fixed Bottom Navigation */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                padding: '10px 20px',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                zIndex: 1000,
                height: '5rem'
            }}>
                <div onClick={() => navigate(-1)} style={{ paddingRight: '10px', cursor: 'pointer', borderRight: '1px solid black' }}>
                    <ArrowLeftOutlined style={{ fontSize: '24px' }} />
                </div>
                <div onClick={() => navigate(routeNames.foodMenu.myCart)} style={{ padding: '0 10px', cursor: 'pointer' }}>
                    <Badge count={cartItemCount} overflowCount={99} size="small">
                        <ShoppingCartOutlined style={{ fontSize: '24px' }} />
                    </Badge>
                </div>
                <div
                    onClick={handleAddToCart}
                    style={{
                        flex: 1,
                        backgroundColor: '#d32f2f',
                        padding: '10px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'white',
                        cursor: 'pointer',
                    }}
                >
                    <Text style={{ color: 'white', margin: 0 }}>{t('foodMenu.detailedFoodPage.addToCart')}</Text>
                    <Text style={{ color: 'white', margin: 0 }}>
                        {(food?.basePrice + selectedOptions.reduce((sum, optionId) => {
                            const selectedOption = food?.options.find(opt => opt.id === optionId);
                            return sum + (selectedOption ? selectedOption.price : 0);
                        }, 0)).toLocaleString()} VND
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default MobileDetailedFoodPage;