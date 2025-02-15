import { Breadcrumb, Col, Empty, Row, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FoodCard from "../../components/cards/foodMenu/FoodCard";
import MenuNavBar from "../../components/navbars/foodMenu/MenuNavBar";
import { apiEndPoints } from "../../constaints/apiEndPoint";
import { routeNames } from "../../constaints/routeName";
import axiosInstance from "../../service/axios";
import RightInformationSection from "./RightInformationSection";

const { Title, Paragraph } = Typography;

const SearchResultPage = () => {
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get("search"); // Get search query from URL
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false); // For fade-in effect

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchQuery) return;
            setLoading(true);
            try {
                const response = await axiosInstance.get(apiEndPoints.FOOD.GET_ALL, {
                    params: { pageIndex: 1, pageSize: 1000, search: searchQuery },
                });
                setSearchResults(response.data.items);
            } catch (error) {
                console.error("Failed to fetch search results:", error);
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [searchQuery]);

    useEffect(() => {
        if (!loading) {
            setTimeout(() => setVisible(true), 100); // Delayed fade-in effect
        }
    }, [loading]);

    return (
        <div>
            <MenuNavBar />
            <div style={{ 
                padding: "5vh 10vw", 
                backgroundColor: "#f4f4f4", 
                minHeight: "100vh",
                opacity: visible ? 1 : 0,
                visibility: visible ? "visible" : "hidden",
                transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out", }}>

                <Row gutter={[16, 16]}>
                    <Col span={18} style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ position: "absolute", left: 0, zIndex: 100 }}>
                            <Breadcrumb
                                items={[
                                    {
                                        title: <Title level={5}><a href={routeNames.foodMenu.main}>Home</a></Title>,
                                    },
                                    {
                                        title: <Title level={5}>Search</Title>,
                                    }
                                ]}
                            />
                        </div>
                        <Title style={{ fontSize: '1.5vw', textAlign: 'center' }}>Search result</Title>
                    </Col>
                    {/* Left Column (16/24) - Search Results */}
                    <Col xs={24} lg={18}>
                        {loading ? (
                            <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
                        ) : searchResults.length > 0 ? (
                            <Row gutter={[16, 16]}>
                                {searchResults.map((food) => (
                                    <Col xs={24} md={12} xl={8} key={food.id}>
                                        <FoodCard food={food} />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Empty description="No results found" style={{ marginTop: "2vh" }} />
                        )}
                    </Col>

                    {/* Right Column (8/24) - Filter Section */}
                    <Col xs={24} lg={6}>
                        <RightInformationSection />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SearchResultPage;
