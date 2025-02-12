import React, { useContext } from "react";
import { DeliveryContext } from "../../../context/DeliveryContext";
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Input } from "antd";

const { Search } = Input;


const MenuNavBar = () => {
    const { cart } = useContext(DeliveryContext);
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "white",
            color: "black",
            padding: "1vh 10vw",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            fontSize: "0.8vw"
        }}>
            {/* Left - Menu Items */}
            <div style={{ display: "flex", gap: "3vw" }}>
                <a href="#" style={{ color: "black", cursor: "pointer" }}>Sample 1</a>
                <a href="#" style={{ color: "black", cursor: "pointer" }}>Sample 2</a>
                <a href="#" style={{ color: "black", cursor: "pointer" }}>Sample 3</a>
            </div>

            {/* Right - Search Bar & Shopping Cart */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                {/* Ant Design Search Bar */}
                <Search
                    placeholder="Search..."
                    style={{ width: "25vw" }}
                />

                {/* Shopping Cart Icon */}
                <div style={{ position: "relative", fontSize: "0.8vw", cursor: "pointer" }}>
                    <ShoppingCartOutlined style={{ fontSize: '2vw' }} />
                    {cartItemCount > 0 && (
                        <span style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-10px",
                            backgroundColor: "red",
                            color: "white",
                            fontSize: "0.6vw",
                            fontWeight: "bold",
                            padding: "3px 6px",
                            borderRadius: "50%",
                            border: "1px solid red"
                        }}>
                            {cartItemCount}
                        </span>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default MenuNavBar;
