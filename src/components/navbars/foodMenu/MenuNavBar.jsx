import { ShoppingCartOutlined } from "@ant-design/icons";
import { Badge, Input, Popover, Typography, Image } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { DeliveryContext } from "../../../context/DeliveryContext";
import { AxiosConstants } from "../../../constaints/axiosContaint";
import { useNavigate } from "react-router-dom";
import { routeNames } from "../../../constaints/routeName";

const { Search } = Input;
const { Paragraph } = Typography;

const MenuNavBar = () => {
    const { cart, latestCartItem } = useContext(DeliveryContext);
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const navigate = useNavigate();

    // Show the popover when latestCartItem changes
    useEffect(() => {
        if (latestCartItem) {
            setIsPopoverVisible(true);
            setTimeout(() => setIsPopoverVisible(false), 3000); // Auto-hide after 3 seconds
        }
    }, [latestCartItem]);

    // Popover Content for New Item Notification
    const popoverContent = latestCartItem ? (
        <div >
            <Paragraph style={{ fontSize: "0.8rem", color: "#888", marginTop: 5 }}>
                A new item has been added to your cart.
            </Paragraph>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px" }}>
                <Image
                    preview={false}
                    src={`${AxiosConstants.AXIOS_BASEURL}/${latestCartItem.imagePath}`}
                    alt={latestCartItem.nameEN}
                    style={{ width: "50px", height: "50px", borderRadius: "5px" }}
                />
                <div>

                    <Paragraph style={{ fontWeight: "bold", marginBottom: 5 }}>
                        {latestCartItem.nameEN}
                    </Paragraph>
                    <Paragraph style={{ margin: 0 }}>
                        <strong>{latestCartItem.total.toLocaleString()} VND</strong>
                    </Paragraph>
                </div>
            </div>
        </div>
    ) : null;

    return (
        <>
            {/* Navbar */}
            <nav
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                    color: "black",
                    padding: "1vh 10vw",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    fontSize: "0.8vw",
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                }}
            >
                {/* Left - Menu Items */}
                <div style={{ display: "flex", gap: "3vw" }}>
                    <a href="#" style={{ color: "black", cursor: "pointer" }}>Sample 1</a>
                    <a href="#" style={{ color: "black", cursor: "pointer" }}>Sample 2</a>
                    <a href="#" style={{ color: "black", cursor: "pointer" }}>Sample 3</a>
                </div>

                {/* Right - Search Bar & Shopping Cart */}
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    {/* Ant Design Search Bar */}
                    <Search placeholder="Search..." style={{ width: "25vw" }} />

                    {/* Shopping Cart Icon with Popover */}
                    <Popover
                        style={{ backgroundColor: 'rgba(255, 200, 200, 0.9)' }}
                        content={popoverContent}
                        open={isPopoverVisible}
                        placement="bottomRight"
                        trigger="click"
                    >
                        <Badge count={cartItemCount} overflowCount={99} size="small">
                            <ShoppingCartOutlined 
                            onClick={() => navigate(routeNames.foodMenu.myCart)}
                            style={{ fontSize: "1.5vw", cursor: "pointer" }} />
                        </Badge>
                    </Popover>
                </div>
            </nav>
        </>
    );
};

export default MenuNavBar;
