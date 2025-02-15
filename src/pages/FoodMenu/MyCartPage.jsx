import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Checkbox, Col, Input, Row, Typography } from "antd";
import React, { useContext, useState } from "react";
import CartItemCard from "../../components/cards/foodMenu/CartItemCard";
import OrderSummaryCard from "../../components/cards/foodMenu/OrderSummaryCard";
import MenuNavBar from "../../components/navbars/foodMenu/MenuNavBar";
import { routeNames } from "../../constaints/routeName";
import { DeliveryContext } from "../../context/DeliveryContext";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;



const MyCartPage = () => {
    const { cart, location } = useContext(DeliveryContext);
    const [condimentState, setCondimentState] = useState({
        ketchup: { checked: false, quantity: 1 },
        chilli_sauce: { checked: false, quantity: 1 },
        chilli_oil: { checked: false, quantity: 1 },
        honey: { checked: false, quantity: 1 },
    });

    // Calculate Sub-total

    // Toggle checkbox selection
    const handleCheckboxChange = (id) => {
        setCondimentState((prev) => ({
            ...prev,
            [id]: { ...prev[id], checked: !prev[id].checked }
        }));
    };

    // Increase quantity
    const increaseQuantity = (id) => {
        setCondimentState((prev) => ({
            ...prev,
            [id]: { ...prev[id], quantity: prev[id].quantity + 1 }
        }));
    };

    // Decrease quantity (minimum of 1)
    const decreaseQuantity = (id) => {
        setCondimentState((prev) => ({
            ...prev,
            [id]: { ...prev[id], quantity: Math.max(1, prev[id].quantity - 1) }
        }));
    };

    return (
        <div>
            <MenuNavBar />
            <div style={{ padding: "5vh 10vw", backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
                <Row gutter={[32, 16]}>
                    <Col span={18}>
                        <Row gutter={[16, 16]} style={{ position: "relative" }}>
                            {/* Title and breadcrumb */}
                            <Col span={24} style={{ display: "flex", justifyContent: "center", borderBottom: "2px solid #ddd", marginBottom: '2vh' }}>
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
                            <Col span={24} style={{ paddingRight: "2vw", position: "relative" }}>
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
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh', marginTop: "2vh" }}>
                                            {cart.map((item) => (
                                                <CartItemCard key={item.cartItemKey} item={item} />
                                            ))}
                                        </div>
                                    </Col>

                                    {/* Condiment & Cutlery Column */}
                                    <Col span={12} style={{ padding: "2vh", borderRadius: "10px" }}>
                                        <Title style={{ fontSize: '1vw', color: "#d32f2f" }}>CONDIMENT & CUTLERY</Title>

                                        {/* Condiment Options Section */}
                                        <div
                                            style={{
                                                marginTop: "2vh",
                                                padding: "1vh 1vw",
                                                backgroundColor: "white",
                                                borderRadius: "10px",
                                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
                                            }}
                                        >
                                            <Title level={5} style={{ fontSize: '0.8vw', color: "#e64a19" }}>CONDIMENT OPTIONS</Title>
                                            <Paragraph style={{ fontSize: "0.8vw", color: "#777" }}>
                                                Condiments are provided as standard. Please adjust the quantity according to your needs.
                                            </Paragraph>

                                            {/* Condiment List */}
                                            {Object.entries(condimentState).map(([id, data]) => (
                                                <div
                                                    key={id}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        marginTop: '0.7vh',
                                                        minHeight: "3vh"  // Ensures consistent height
                                                    }}
                                                >
                                                    {/* Checkbox & Label */}
                                                    <div style={{ display: "flex", alignItems: "center", gap: "1vw" }}>
                                                        <Checkbox
                                                            id={id}
                                                            checked={data.checked}
                                                            onChange={() => handleCheckboxChange(id)}
                                                            style={{ transform: "scale(1.2)" }}
                                                        />
                                                        <label htmlFor={id} style={{ fontSize: "0.8vw", cursor: "pointer", color: "#b71c1c" }}>
                                                            {id.replace("_", " ").toUpperCase()}
                                                        </label>
                                                    </div>

                                                    {/* Quantity Control Buttons (Reserve space to avoid height change) */}
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "0.5vw",
                                                            opacity: data.checked ? 1 : 0,
                                                            visibility: data.checked ? "visible" : "hidden",
                                                            height: "100%",
                                                            transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out"
                                                        }}
                                                    >
                                                        <Button
                                                            icon={<MinusOutlined />}
                                                            shape="circle"
                                                            size="small"
                                                            onClick={() => decreaseQuantity(id)}
                                                            style={{
                                                                padding: "0.3vw",
                                                                fontSize: "0.7vw",
                                                                color: "#b71c1c",
                                                                borderColor: "#b71c1c"
                                                            }}
                                                        />
                                                        <span style={{ textAlign: "center", fontSize: "0.7vw", fontWeight: "bold", color: "#b71c1c" }}>
                                                            {data.quantity}
                                                        </span>
                                                        <Button
                                                            icon={<PlusOutlined />}
                                                            shape="circle"
                                                            size="small"
                                                            onClick={() => increaseQuantity(id)}
                                                            style={{
                                                                padding: "0.3vw",
                                                                fontSize: "0.7vw",
                                                                color: "#b71c1c",
                                                                borderColor: "#b71c1c"
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                            ))}

                                            {/* Sustainable Options Section */}
                                            <Title level={5} style={{ fontSize: '0.8vw', color: "#e64a19", marginTop: '2vh' }}>SUSTAINABLE OPTIONS</Title>
                                            <Paragraph style={{ fontSize: "0.8vw", color: "#777" }}>
                                                Please tick only if you need.
                                            </Paragraph>

                                            {/* Sustainable Options List */}
                                            {[
                                                { id: "cutlery", label: "Cutlery" },
                                                { id: "pizza_reheating_foil", label: "Pizza Reheating Foil" },
                                                { id: "heating_instructions", label: "Heating Instructions" }
                                            ].map((option) => (
                                                <div
                                                    key={option.id}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "1vw",
                                                        marginTop: "0.7vh"
                                                    }}
                                                >
                                                    <Checkbox id={option.id} style={{ transform: "scale(1.2)" }} />
                                                    <label htmlFor={option.id} style={{ fontSize: "0.8vw", cursor: "pointer", color: "#1565c0" }}>
                                                        {option.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Allergen Notice */}
                                        <Paragraph style={{ fontSize: "0.8vw", color: "#d32f2f", marginTop: "2vh" }}>
                                            If you need to remove any ingredients due to allergens, please let us know.
                                        </Paragraph>

                                        {/* User Notes Section */}
                                        <div
                                            style={{
                                                marginTop: "1vh",
                                                padding: "1vh 1vw",
                                                backgroundColor: "white",
                                                borderRadius: "10px",
                                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
                                            }}
                                        >
                                            <TextArea
                                                rows={4}
                                                placeholder="Enter note here..."
                                                style={{ fontSize: "0.8vw", resize: "none" }}
                                            />
                                        </div>

                                        {/* E-Voucher Section */}
                                        <Title level={5} style={{ fontSize: '0.8vw', color: "#d32f2f", marginTop: "2vh" }}>E-VOUCHER</Title>
                                        <Paragraph style={{ fontSize: "0.8vw", color: "#777" }}>
                                            Input your E-Voucher (if available).
                                        </Paragraph>
                                        <div
                                            style={{
                                                marginTop: "1vh",
                                                padding: "1vh 1vw",
                                                backgroundColor: "white",
                                                borderRadius: "10px",
                                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
                                            }}
                                        >
                                            <Input
                                                placeholder="Enter your E-Voucher here..."
                                                style={{ fontSize: "0.8vw" }}
                                            />
                                        </div>
                                    </Col>


                                </Row>


                            </Col>
                        </Row>
                    </Col>
                    {/* Right Side (8/24) - Summary or Checkout */}
                    <Col span={6}>
                       <OrderSummaryCard/>
                    </Col>
                </Row>


            </div>
        </div>
    );
};

export default MyCartPage;
