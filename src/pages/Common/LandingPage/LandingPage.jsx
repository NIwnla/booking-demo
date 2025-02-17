import { Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LandingPageLoading from "../../../components/loadings/LandingPageLoading";
import { AuthContext } from "../../../context/AuthContext";
import LandingPageFirstPart from "./LandingPageFirstPart";
import LandingPageSecondPart from "./LandingPageSecondPart";
import LandingPageThirdPart from "./LandingPageThirdPart";
import LandingPageFourthPart from "./LandingPageFourthPart";

const { Title, Text } = Typography;

const LandingPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const { role, setAuthToken } = useContext(AuthContext);
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        setTimeout(() => setLoading(false), 2000);
    }, []);

    useEffect(() => {
        if (token) {
            setAuthToken(token);
        }
    }, [token, setAuthToken]);


    return (
        <div>
            <LandingPageLoading loading={loading} />
            <LandingPageFirstPart />
            <LandingPageSecondPart />
            <LandingPageThirdPart />
            <LandingPageFourthPart/>
        </div>
    );
};

export default LandingPage;
