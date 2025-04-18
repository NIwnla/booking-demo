import React, { useContext, useEffect, useState } from "react";
import { Card, Typography, Divider, Button } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DeliveryContext } from "../../../../context/DeliveryContext";
import { routeNames } from "../../../../constaints/routeName";
import LocationPickerModal from "../../components/LocationPickerModal";
import dayjs from "dayjs";
import DeliveryTimePickerModal from "../../components/DeliveryTimePickerModal";

const { Title, Paragraph } = Typography;

const OrderSummarySection = ({ onProcess, onCancel }) => {
    const { cart, location, deliveryTime, setDeliveryTime } = useContext(DeliveryContext);
    const { t } = useTranslation("global");
    const navigate = useNavigate();
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

    // Calculate summary values
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subTotal = cart.reduce((sum, item) => sum + item.total, 0);
    const shippingCost = subTotal > 50000 ? 0 : 5000; // Free shipping if subtotal > 50,000 VND
    const tax = Math.round(subTotal * 0.1);
    const total = subTotal + shippingCost + tax;

    const [disableProcess , setDisableProcess] = useState(!location || !deliveryTime);
    useEffect(() => {
        setDisableProcess(!location ||!deliveryTime);
    }, [location, deliveryTime])

    return (
        <>
            <Card
                style={{ textAlign: 'start', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer' }}
                onClick={() => setIsLocationModalOpen(true)}
            >
                <Paragraph>
                    📍 <strong>{t("foodMenu.orderSummary.location")}: </strong>
                    {location ? location.formattedAddress : t("foodMenu.orderSummary.locationPlaceholder")}

                </Paragraph>
            </Card>


            <Card
                style={{ textAlign: 'start', borderRadius: '10px', marginBottom: '20px', cursor: 'pointer' }}
                onClick={() => setIsTimeModalOpen(true)}
            >
                <Paragraph>
                    🕒 <strong>{t("foodMenu.orderSummary.deliveryTime")}: </strong>
                    {deliveryTime ? dayjs(deliveryTime).format('DD/MM/YYYY HH:mm') : t("foodMenu.orderSummary.noDeliveryTime")}
                </Paragraph>
            </Card>

            <Card
                style={{
                    textAlign: "start",
                    borderRadius: "20px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    backgroundColor: "white",
                }}
                title={<Title style={{ margin: 0, textAlign: "center", fontSize: "1rem" }}>{t("foodMenu.orderSummary.title")}</Title>}
            >
                <Title style={{ fontSize: "1rem", marginBottom: "2vh" }}>
                    {t("foodMenu.orderSummary.instantDelivery")} ({cartItemCount})
                </Title>

                {/* Order Info */}
                <div style={{ paddingLeft: "1vw" }}>
                    {/* Sub-Total */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Paragraph style={{ fontSize: "0.875rem" }}>{t("foodMenu.orderSummary.subTotal")}:</Paragraph>
                        <Paragraph style={{ fontSize: "0.875rem" }}>{subTotal.toLocaleString()} VND</Paragraph>
                    </div>

                    {/* Shipping */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Paragraph style={{ fontSize: "0.875rem" }}>{t("foodMenu.orderSummary.shipping")}:</Paragraph>
                        <Paragraph style={{ fontSize: "0.875rem" }}>
                            {shippingCost > 0 ? `${shippingCost.toLocaleString()} VND` : t("foodMenu.orderSummary.freeShipping")}
                        </Paragraph>
                    </div>

                    <Divider dashed style={{ margin: "0.5vh 0", borderTop: "1px dashed rgb(46, 46, 46)" }} />

                    {/* Tax */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Paragraph style={{ fontSize: "0.875rem" }}>{t("foodMenu.orderSummary.tax", { taxRate: 10 })}:</Paragraph>
                        <Paragraph style={{ fontSize: "0.875rem" }}>{tax.toLocaleString()} VND</Paragraph>
                    </div>
                </div>

                {/* Divider */}
                <Divider style={{ margin: "1vh 0", borderTop: "1px solid rgb(46, 46, 46)" }} />

                {/* Total */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: "bold" }}>
                    <Paragraph style={{ fontSize: "1rem", fontWeight: "bold" }}>{t("foodMenu.orderSummary.total")}:</Paragraph>
                    <Paragraph style={{ fontSize: "1rem", fontWeight: "bold" }}>{total.toLocaleString()} VND</Paragraph>
                </div>

                {/* Delivering To */}
                <Title level={5} style={{ fontSize: "1rem", marginTop: "1vh" }}>{t("foodMenu.orderSummary.deliveringTo")}:</Title>
                <Paragraph style={{ fontSize: "0.875rem", color: "#555" }}>{location ? location.formattedAddress : t("foodMenu.orderSummary.noLocation")}</Paragraph>

                {/* Estimated Delivery Time */}
                <Title level={5} style={{ fontSize: "1rem", marginTop: "1vh" }}>{t("foodMenu.orderSummary.estimatedDelivery")}:</Title>
                <Paragraph style={{ fontSize: "0.875rem", color: "#555" }}>
                    {new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Paragraph>

                {/* Terms & Conditions */}
                <Paragraph style={{ fontSize: "0.875rem", color: "#777", marginTop: "10vh" }}>
                    {t("foodMenu.orderSummary.terms")} <a href="#">{t("foodMenu.orderSummary.termsLink")}</a>.
                </Paragraph>

                {/* Checkout Button */}
                {cartItemCount > 0 &&
                    <div
                        style={{
                            backgroundColor: disableProcess ? 'gray' : "#d32f2f",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "1vh 1vw",
                            marginTop: "2vh",
                            borderRadius: "2vw",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                            cursor: disableProcess ? 'default' : "pointer",
                            transition: "background 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = disableProcess ? 'gray' : "#e64a4a")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = disableProcess ? 'gray' : "#d32f2f")}
                        onClick={disableProcess ? {} : onProcess}
                    >
                        {disableProcess ? (
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography
                                    style={{
                                        fontSize: "0.875rem",
                                        color: "white",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5vw",
                                    }}
                                >
                                    {!location && !deliveryTime
                                        ? t("foodMenu.orderSummary.pickLocationAndTime")
                                        : !location
                                            ? t("foodMenu.orderSummary.pickLocation")
                                            : t("foodMenu.orderSummary.pickTime")
                                    }
                                </Typography>
                            </div>
                        ) : (
                            <>
                                <Title level={4} style={{ fontSize: "0.875rem", margin: 0, color: "white", paddingLeft:'10px' }}>
                                    {total.toLocaleString()} VND
                                </Title>
                                <Typography
                                    style={{
                                        fontSize: "0.875rem",
                                        color: "white",
                                        paddingRight: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5vw",
                                    }}
                                >
                                    {t("foodMenu.orderSummary.process")} <RightCircleOutlined style={{ fontSize: "1.5rem" }} />
                                </Typography>
                            </>)}
                    </div >}

                {/* Cancel Button */}
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <Button type="link" onClick={onCancel} style={{ fontSize: "1rem" }}>
                        {t("foodMenu.orderSummary.cancel")}
                    </Button>
                </div>
            </Card >
            <LocationPickerModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
            />
            <DeliveryTimePickerModal
                isOpen={isTimeModalOpen}
                onClose={() => setIsTimeModalOpen(false)}
                value={deliveryTime}
                onChange={(time) => {
                    setDeliveryTime(time ? time.toISOString() : null);
                    setIsTimeModalOpen(false);
                }}
            />
        </>
    );
};

export default OrderSummarySection;
