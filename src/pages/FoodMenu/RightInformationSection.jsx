import { DeleteOutlined, RightCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Typography } from 'antd';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../../components/cards/foodMenu/CartItemCard';
import { routeNames } from '../../constaints/routeName';
import { DeliveryContext } from '../../context/DeliveryContext';
import { useTranslation } from "react-i18next";
import LocationPickerModal from '../../components/modals/foodMenu/LocationPickerModal';

const { Paragraph, Title } = Typography;

const RightInformationSection = () => {
    const { t } = useTranslation("global");
    const { cart, clearCart, location } = useContext(DeliveryContext);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const cartIsEmpty = cart.length === 0;
    const navigate = useNavigate();
    const totalCartPrice = cart.reduce((sum, item) => sum + item.total, 0);

    return (
        <div>
            <Card 
                style={{ textAlign: 'start', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer' }}
                onClick={() => setIsLocationModalOpen(true)}
            >
                <Paragraph>
                    📍 <strong>{t('foodMenu.rightInformation.location')}:</strong>{' '}
                    {location ? location.formattedAddress : t('foodMenu.mainPage.selectLocation')}
                </Paragraph>
            </Card>

            <Title level={4} style={{ marginBottom: '10px' }}>{t('foodMenu.rightInformation.shoppingCart')}</Title>

            {!cartIsEmpty && (
                <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={clearCart}
                    style={{
                        width: '100%',
                        marginBottom: '10px',
                        backgroundColor: 'red',
                        border: 'none'
                    }}
                >
                    {t('foodMenu.rightInformation.clearAll')}
                </Button>
            )}

            {cartIsEmpty ? (
                <Card
                    style={{
                        borderRadius: '10px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        backgroundColor: 'white'
                    }}>
                    <Empty
                        image={<ShoppingCartOutlined style={{ fontSize: '7rem', color: '#bfbfbf' }} />}
                        description={t('foodMenu.rightInformation.emptyCart')}
                    />
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
                    {cart.map((item) => (
                        <CartItemCard key={item.cartItemKey} item={item} />
                    ))}

                    {/* Total Price & View Cart Button */}
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
                        onClick={() => navigate(routeNames.foodMenu.myCart)}
                    >
                        <Title level={4} style={{ fontSize: "1vw", margin: 0, color: 'white' }}>
                            {totalCartPrice.toLocaleString()} VND
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
                            {t('foodMenu.rightInformation.viewCart')} <RightCircleOutlined style={{ fontSize: "2vw" }} />
                        </Typography>
                    </div>
                </div>
            )}
            <LocationPickerModal 
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
            />
        </div>
    );
};

export default RightInformationSection;
