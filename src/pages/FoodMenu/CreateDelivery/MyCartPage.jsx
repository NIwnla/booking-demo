import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Checkbox, Col, Input, Row, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import CartItemCard from "../../../components/cards/foodMenu/CartItemCard";
import MenuNavBar from "../../../components/navbars/foodMenu/MenuNavBar";
import { routeNames } from "../../../constaints/routeName";
import { DeliveryContext } from "../../../context/DeliveryContext";
import OrderSummarySection from './components/OrderSummarySection';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;



const MyCartPage = () => {
    const { t } = useTranslation('global');
    const { cart, condiments, sustainableOptions, updateCondiments, updateSustainableOptions } = useContext(DeliveryContext);    
    const navigate = useNavigate();

    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const handleCheckboxChange = (id) => {
        updateCondiments(id, !condiments[id].checked, condiments[id].quantity);
    };

    const handleSustainableChange = (id) => {
        updateSustainableOptions(id, !sustainableOptions[id].checked);
    };

    const increaseQuantity = (id) => {
        updateCondiments(id, condiments[id].checked, condiments[id].quantity + 1);
    };

    const decreaseQuantity = (id) => {
        updateCondiments(id, condiments[id].checked, Math.max(1, condiments[id].quantity - 1));
    };

    return (
        <div>
            <MenuNavBar />
            <div style={{ padding: "5vh 10vw", backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
                <Row gutter={[32, 16]}>
                    <Col xs={24} lg={18}>
                        <Row gutter={[16, 16]} style={{ position: "relative" }}>
                            {/* Title and breadcrumb */}
                            <Col span={24} style={{ display: "flex", justifyContent: "center", borderBottom: "2px solid #ddd", marginBottom: '2vh' }}>
                                <div style={{ position: "absolute", left: 0, zIndex: 100 }}>
                                    <Breadcrumb
                                        items={[
                                            {
                                                title: <Title level={5}><a href={routeNames.foodMenu.main}>{t('foodMenu.breadcrumbs.home')}</a></Title>,
                                            },
                                            {
                                                title: <Title level={5}>{t('foodMenu.cart.title')}</Title>,
                                            }
                                        ]}
                                    />
                                </div>
                                <Title style={{ fontSize: '1.5rem', textAlign: 'center' }}>{t('foodMenu.cart.title')} ({cart.length})</Title>
                            </Col>
                            <Col span={24} style={{ paddingRight: "2vw", position: "relative" }}>
                                <Row gutter={[64, 16]}>
                                    {/* Product Details Column */}
                                    <Col
                                        xs={24} lg={12}
                                        style={{
                                            padding: "2vh",
                                            borderRadius: "10px",
                                            borderRight: "2px dashed #ddd"
                                        }}
                                    >
                                        <Title style={{ fontSize: '1rem' }}>{t('foodMenu.cart.productDetails')}</Title>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh', marginTop: "2vh" }}>
                                            {cart.map((item) => (
                                                <CartItemCard key={item.cartItemKey} item={item} isLargeScreen={isLargeScreen} />
                                            ))}
                                        </div>
                                    </Col>

                                    {/* Condiment & Cutlery Column */}
                                    <Col xs={24} lg={12} style={{ padding: "2vh", borderRadius: "10px" }}>
                                        <Title style={{ fontSize: '1rem', color: "#d32f2f" }}>{t('foodMenu.cart.condimentSectionTitle')}</Title>

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
                                            <Title level={5} style={{ fontSize: '0.875rem', color: "#e64a19" }}>{t('foodMenu.cart.condimentOptions')}</Title>
                                            <Paragraph style={{ fontSize: "0.875rem", color: "#777" }}>
                                                {t('foodMenu.cart.condimentDescription')}
                                            </Paragraph>

                                            {/* Condiment List */}
                                            {Object.entries(condiments).map(([id, data]) => (
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
                                                        <label htmlFor={id} style={{ fontSize: "0.875rem", cursor: "pointer", color: "#b71c1c" }}>
                                                            {t(`foodMenu.cart.condiments.${id}`)}
                                                        </label>
                                                    </div>

                                                    {/* Quantity Control Buttons (Reserve space to avoid height change) */}
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "0.5rem",
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
                                                                padding: "0.3rem",
                                                                fontSize: "0.75rem",
                                                                color: "#b71c1c",
                                                                borderColor: "#b71c1c"
                                                            }}
                                                        />
                                                        <span style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: "bold", color: "#b71c1c" }}>
                                                            {data.quantity}
                                                        </span>
                                                        <Button
                                                            icon={<PlusOutlined />}
                                                            shape="circle"
                                                            size="small"
                                                            onClick={() => increaseQuantity(id)}
                                                            style={{
                                                                padding: "0.3rem",
                                                                fontSize: "0.75rem",
                                                                color: "#b71c1c",
                                                                borderColor: "#b71c1c"
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                            ))}

                                            {/* Sustainable Options Section */}
                                            <Title level={5} style={{ fontSize: '0.875rem', color: "#e64a19", marginTop: '2vh' }}>{t('foodMenu.cart.sustainableOptions')}</Title>
                                            <Paragraph style={{ fontSize: "0.875rem", color: "#777" }}>
                                                {t('foodMenu.cart.sustainableDescription')}
                                            </Paragraph>

                                            {/* Sustainable Options List */}
                                            {Object.entries(sustainableOptions).map(([id, data]) => (
                                                <div
                                                    key={id}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "1vw",
                                                        marginTop: "0.7vh"
                                                    }}
                                                >
                                                    <Checkbox
                                                        id={id}
                                                        style={{ transform: "scale(1.2)" }}
                                                        checked={data.checked}
                                                        onChange={() => handleSustainableChange(id)}
                                                    />
                                                    <label htmlFor={id} style={{ fontSize: "0.875rem", cursor: "pointer", color: "#1565c0" }}>
                                                        {t(`foodMenu.cart.condiments.${id}`)}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Allergen Notice */}
                                        <Paragraph style={{ fontSize: "0.875rem", color: "#d32f2f", marginTop: "2vh" }}>
                                            {t('foodMenu.cart.allergenNotice')}
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
                                                placeholder={t('foodMenu.cart.allergenPlaceholder')}
                                                style={{ fontSize: "0.875rem", resize: "none" }}
                                            />
                                        </div>

                                        {/* E-Voucher Section */}
                                        <Title level={5} style={{ fontSize: '0.875rem', color: "#d32f2f", marginTop: "2vh" }}>{t('foodMenu.cart.eVoucher')}</Title>
                                        <Paragraph style={{ fontSize: "0.875rem", color: "#777" }}>
                                            {t('foodMenu.cart.eVoucherDescription')}
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
                                                placeholder={t('foodMenu.cart.eVoucherPlaceholder')}
                                                style={{ fontSize: "0.875rem" }}
                                            />
                                        </div>
                                    </Col>


                                </Row>


                            </Col>
                        </Row>
                    </Col>
                    {/* Right Side (8/24) - Summary or Checkout */}
                    <Col xs={24} lg={6}>
                        <OrderSummarySection
                            onProcess={() => navigate(routeNames.foodMenu.orderInfo)}
                            onCancel={() => navigate(routeNames.foodMenu.main)} />
                    </Col>
                </Row>


            </div>
        </div>
    );
};

export default MyCartPage;
