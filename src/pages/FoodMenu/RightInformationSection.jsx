import React, { useContext } from 'react';
import { Typography, Empty, Image, Button, Card, Row, Col } from 'antd';
import { ShoppingCartOutlined, MinusOutlined, PlusOutlined, CloseOutlined, DeleteOutlined, RightOutlined, RightCircleOutlined } from '@ant-design/icons';
import { DeliveryContext } from '../../context/DeliveryContext';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { getLocalizedText } from '../../helpers/getLocalizedText';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { routeNames } from '../../constaints/routeName';
import CartItemCard from '../../components/cards/foodMenu/CartItemCard';

const { Paragraph, Title } = Typography;

const RightInformationSection = () => {
    const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart } = useContext(DeliveryContext);
    const cartIsEmpty = cart.length === 0;
    const { i18n } = useTranslation('global');
    const navigate = useNavigate();

    const totalCartPrice = cart.reduce((sum, item) => sum + item.total, 0);

    return (
        <div>
            <Card style={{ textAlign: 'start', borderRadius: '10px', marginBottom: '20px' }}>
                <Paragraph>📍 <strong>Location:</strong> Your location details here</Paragraph>
            </Card>

            <Title level={4} style={{ marginBottom: '10px' }}>Shopping Cart</Title>

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
                    Clear All
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
                        description="Your shopping cart is empty"
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
                            View Cart <RightCircleOutlined style={{ fontSize: "2vw" }} />
                        </Typography>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RightInformationSection;
