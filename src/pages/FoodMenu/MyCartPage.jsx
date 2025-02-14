import React, { useContext } from "react";
import { Row, Col, Card, Typography, Breadcrumb } from "antd";
import { DeliveryContext } from "../../context/DeliveryContext";
import { routeNames } from "../../constaints/routeName";
import MenuNavBar from "../../components/navbars/foodMenu/MenuNavBar";
import CartItemCard from "../../components/cards/foodMenu/CartItemCard";

const { Title, Paragraph } = Typography;


const MyCartPage = () => {
    const { cart } = useContext(DeliveryContext);

    return (
        <div>
            <MenuNavBar />
            <div style={{ padding: "5vh 10vw", backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
                <Row gutter={[16, 16]} style={{ position: "relative" }}>
                    <Col xs={24} lg={16} style={{ display: "flex", justifyContent: "center", borderBottom: "2px solid #ddd", marginBottom: '2vh' }}>
                        <div style={{ position: "absolute", left: 0, zIndex: 100 }}>
                            <Breadcrumb
                                items={[
                                    {
                                        title: <Title level={5}><a href={routeNames.foodMenu.main}>Home</a></Title>,
                                    },
                                    {
                                        title: <Title level={5}>My Cart</Title>,
                                    }
                                ]}
                            />
                        </div>
                        <Title style={{ fontSize: '1.5vw', textAlign: 'center' }}>My Cart ({cart.length})</Title>
                    </Col>
                    {/* Left Side (16/24) - Cart Items */}
                    <Col xs={24} lg={16} style={{ paddingRight: "2vw", position: "relative" }}>
                        <Row gutter={[64, 16]}>
                            {/* Product Details Column */}
                            <Col
                                span={12}
                                style={{
                                    padding: "2vh",
                                    borderRadius: "10px",
                                    borderRight: "2px dashed #ddd"
                                }}
                            >
                                <Title style={{ fontSize: '1vw' }}>Product details</Title>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
                                    {cart.map((item) => (
                                        <CartItemCard key={item.cartItemKey} item={item} />
                                    ))}
                                </div>
                            </Col>

                            {/* Condiment & Cutlery Column */}
                            <Col span={12} style={{ padding: "2vh", borderRadius: "10px" }}>
                                <Title style={{ fontSize: '1vw' }}>CONDIMENT & CUTLERY</Title>
                            </Col>
                        </Row>


                    </Col>

                    {/* Right Side (8/24) - Summary or Checkout */}
                    <Col xs={24} lg={8}>
                        <Card style={{ textAlign: 'start', borderRadius: '10px', marginBottom: '20px' }}>
                            <Paragraph>📍 <strong>Location:</strong> Your location details here</Paragraph>
                        </Card>
                    </Col>
                </Row>

            </div>
        </div>
    );
};

export default MyCartPage;
