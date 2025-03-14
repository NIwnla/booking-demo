import { LoadingOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { AutoComplete, Badge, Popover, Spin, Typography, Image } from "antd";
import debounce from "lodash/debounce";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { apiEndPoints } from "../../../constaints/apiEndPoint";
import { routeNames } from "../../../constaints/routeName";
import { DeliveryContext } from "../../../context/DeliveryContext";
import { getLocalizedText } from "../../../helpers/getLocalizedText";
import axiosInstance from "../../../service/axios";
import { AxiosConstants } from "../../../constaints/axiosContaint";

const { Paragraph } = Typography;

const MenuNavBar = () => {
    const { cart, latestCartItem } = useContext(DeliveryContext);
    const { t, i18n } = useTranslation("global");
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Show popover when latestCartItem changes
    useEffect(() => {
        if (latestCartItem) {
            setIsPopoverVisible(true);
            setTimeout(() => setIsPopoverVisible(false), 3000);
        }
    }, [latestCartItem]);

    // Debounced API call function
    const fetchSuggestions = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setSearchResults([]);
                setIsLoading(false);
                return;
            }
            try {
                const response = await axiosInstance.get(apiEndPoints.FOOD.SUGGESTION, {
                    params: { search: query },
                });

                setSearchResults(
                    response.data.length > 0
                        ? Array.from(
                            new Map(
                                response.data.map((item) => [
                                    getLocalizedText(item, "name", i18n.language),
                                    {
                                        value: getLocalizedText(item, "name", i18n.language),
                                        label: (
                                            <div
                                                style={{
                                                    whiteSpace: "normal",
                                                    wordWrap: "break-word",
                                                    overflowWrap: "break-word",
                                                    maxWidth: "100%",
                                                }}
                                            >
                                                {getLocalizedText(item, "name", i18n.language)}
                                            </div>
                                        ),
                                    }
                                ])
                            ).values()
                        )
                        : [{ value: "no-result", label: <span style={{ color: "gray", fontStyle: "italic" }}>{t('foodMenu.navbar.noResults')}</span>, disabled: true }]
                );
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
            } finally {
                setIsLoading(false); // Stop loading
            }
        }, 1000),
        [i18n.language]
    );

    const handleSelect = (value) => {
        setSearchValue(value);
        navigate(`${routeNames.foodMenu.searchResult}?search=${value}`);
    };

    // Handle search input change
    const handleSearch = (query) => {
        setIsLoading(true);
        setSearchValue(query);
        if (!query.trim()) {
            setSearchResults([]);
            setIsLoading(false);
            return;
        }
        fetchSuggestions(query);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && searchValue.trim()) {
            navigate(`${routeNames.foodMenu.searchResult}?search=${encodeURIComponent(searchValue)}`);
        }
    };

    // Popover Content for New Item Notification
    const popoverContent = latestCartItem ? (
        <div>
            <Paragraph style={{ fontSize: "0.875rem", color: "#888", marginTop: 5 }}>
                {t('foodMenu.navbar.newItemAdded')}
            </Paragraph>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px" }}>
                <Image
                    preview={false}
                    src={`${AxiosConstants.AXIOS_BASEURL}/${latestCartItem.imagePath}`}
                    alt={getLocalizedText(latestCartItem, "name", i18n.language)}
                    style={{ width: "50px", height: "50px", borderRadius: "5px" }}
                />
                <div>
                    <Paragraph style={{ fontWeight: "bold", marginBottom: 5 }}>
                        {getLocalizedText(latestCartItem, "name", i18n.language)}
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
            <nav
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                    color: "black",
                    padding: "1vh 10vw",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    fontSize: "0.875rem",
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                }}
            >
                {/* Left - Menu Items */}
                <div style={{ display: "flex", gap: "3vw" }}>
                    <a href="#" style={{ color: "black", cursor: "pointer" }}>{t('foodMenu.navbar.menu.sample1')}</a>
                    <a href="#" style={{ color: "black", cursor: "pointer" }}>{t('foodMenu.navbar.menu.sample2')}</a>
                    <a href="#" style={{ color: "black", cursor: "pointer" }}>{t('foodMenu.navbar.menu.sample3')}</a>
                </div>

                {/* Right - Search Bar & Shopping Cart */}
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    {/* Ant Design Search Bar with AutoComplete */}
                    <AutoComplete
                        options={isLoading ? [{ value: "loading", label: <Spin indicator={<LoadingOutlined />} /> }] : searchResults}
                        style={{ width: "25vw" }}
                        onSearch={handleSearch}
                        value={searchValue}
                        onSelect={handleSelect}
                        onKeyDown={handleKeyDown}
                        placeholder={t('foodMenu.navbar.searchPlaceholder')}
                        filterOption={false}
                    />

                    {/* Shopping Cart Icon with Popover */}
                    <Popover content={popoverContent} open={isPopoverVisible} placement="bottomRight" trigger="click">
                        <Badge count={cartItemCount} overflowCount={99} size="small">
                            <ShoppingCartOutlined onClick={() => navigate(routeNames.foodMenu.myCart)} style={{ fontSize: "1.5rem", cursor: "pointer" }} />
                        </Badge>
                    </Popover>
                </div>
            </nav>
        </>
    );
};

export default MenuNavBar;
