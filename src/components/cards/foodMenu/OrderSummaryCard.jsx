import React, { useContext } from "react";
import { Card, Typography, Divider, Button } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DeliveryContext } from "../../../context/DeliveryContext";
import { routeNames } from "../../../constaints/routeName";

const { Title, Paragraph } = Typography;

const OrderSummaryCard = ({ onProcess = null, onCancel = null }) => {
    const { cart, location } = useContext(DeliveryContext);
    const { t } = useTranslation("global");
    const navigate = useNavigate();

    // Calculate summary values
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subTotal = cart.reduce((sum, item) => sum + item.total, 0);
    const shippingCost = subTotal > 50000 ? 0 : 5000; // Free shipping if subtotal > 50,000 VND
    const tax = Math.round(subTotal * 0.1);
    const total = subTotal + shippingCost + tax;

    return (
        <>
            <Card style={{ textAlign: "start", borderRadius: "20px", marginBottom: "20px" }}>
                <Paragraph>📍 <strong>{t("foodMenu.orderSummary.location")}:</strong> {t("foodMenu.orderSummary.locationPlaceholder")}</Paragraph>
            </Card>

            <Card
                style={{
                    textAlign: "start",
                    borderRadius: "20px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    backgroundColor: "white",
                }}
                title={<Title style={{ margin: 0, textAlign: "center", fontSize: "1vw" }}>{t("foodMenu.orderSummary.title")}</Title>}
            >
                <Title style={{ fontSize: "1vw", marginBottom: "2vh" }}>
                    {t("foodMenu.orderSummary.instantDelivery")} ({cartItemCount})
                </Title>

                {/* Order Info */}
                <div style={{ paddingLeft: "1vw" }}>
                    {/* Sub-Total */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Paragraph style={{ fontSize: "0.7vw" }}>{t("foodMenu.orderSummary.subTotal")}:</Paragraph>
                        <Paragraph style={{ fontSize: "0.7vw" }}>{subTotal.toLocaleString()} VND</Paragraph>
                    </div>

                    {/* Shipping */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Paragraph style={{ fontSize: "0.7vw" }}>{t("foodMenu.orderSummary.shipping")}:</Paragraph>
                        <Paragraph style={{ fontSize: "0.7vw" }}>
                            {shippingCost > 0 ? `${shippingCost.toLocaleString()} VND` : t("foodMenu.orderSummary.freeShipping")}
                        </Paragraph>
                    </div>

                    <Divider dashed style={{ margin: "0.5vh 0", borderTop: "1px dashed rgb(46, 46, 46)" }} />

                    {/* Tax */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Paragraph style={{ fontSize: "0.7vw" }}>{t("foodMenu.orderSummary.tax", { taxRate: 10 })}:</Paragraph>
                        <Paragraph style={{ fontSize: "0.7vw" }}>{tax.toLocaleString()} VND</Paragraph>
                    </div>
                </div>

                {/* Divider */}
                <Divider style={{ margin: "1vh 0", borderTop: "1px solid rgb(46, 46, 46)" }} />

                {/* Total */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1vw", fontWeight: "bold" }}>
                    <Paragraph style={{ fontSize: "0.9vw", fontWeight: "bold" }}>{t("foodMenu.orderSummary.total")}:</Paragraph>
                    <Paragraph style={{ fontSize: "0.9vw", fontWeight: "bold" }}>{total.toLocaleString()} VND</Paragraph>
                </div>

                {/* Delivering To */}
                <Title level={5} style={{ fontSize: "0.9vw", marginTop: "1vh" }}>{t("foodMenu.orderSummary.deliveringTo")}:</Title>
                <Paragraph style={{ fontSize: "0.8vw", color: "#555" }}>{location || t("foodMenu.orderSummary.noLocation")}</Paragraph>

                {/* Estimated Delivery Time */}
                <Title level={5} style={{ fontSize: "0.9vw", marginTop: "1vh" }}>{t("foodMenu.orderSummary.estimatedDelivery")}:</Title>
                <Paragraph style={{ fontSize: "0.8vw", color: "#555" }}>
                    {new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Paragraph>

                {/* Terms & Conditions */}
                <Paragraph style={{ fontSize: "0.8vw", color: "#777", marginTop: "10vh" }}>
                    {t("foodMenu.orderSummary.terms")} <a href="#">{t("foodMenu.orderSummary.termsLink")}</a>.
                </Paragraph>

                {/* Checkout Button */}
                <div
                    style={{
                        backgroundColor: "#d32f2f",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1vh 1vw",
                        marginTop: "2vh",
                        borderRadius: "2vw",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                        cursor: "pointer",
                        transition: "background 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e64a4a")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#d32f2f")}
                    onClick={() => onProcess ? onProcess() : navigate(routeNames.foodMenu.orderInfo)}
                >
                    <Title level={4} style={{ fontSize: "0.7vw", margin: 0, color: "white" }}>
                        {total.toLocaleString()} VND
                    </Title>
                    <Typography
                        style={{
                            fontSize: "0.7vw",
                            color: "white",
                            paddingRight: "0.1vw",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5vw",
                        }}
                    >
                        {t("foodMenu.orderSummary.process")} <RightCircleOutlined style={{ fontSize: "1.5vw" }} />
                    </Typography>
                </div>

                {/* Cancel Button */}
                <div style={{ textAlign: "center", marginTop: "1vh" }}>
                    <Button type="link" onClick={() => onCancel ? onCancel() : navigate(routeNames.foodMenu.main)} style={{ fontSize: "0.9vw" }}>
                        {t("foodMenu.orderSummary.cancel")}
                    </Button>
                </div>
            </Card>
        </>
    );
};

export default OrderSummaryCard;
