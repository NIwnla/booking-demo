import { Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LandingPageLoading from "../../../components/loadings/LandingPageLoading";
import { AuthContext } from "../../../context/AuthContext";
import LandingPageEighthPart from "./LandingPageEighthPart";
import LandingPageFifthPart from "./LandingPageFifthPart";
import LandingPageFirstPart from "./LandingPageFirstPart";
import LandingPageFourthPart from "./LandingPageFourthPart";
import LandingPageSecondPart from "./LandingPageSecondPart";
import LandingPageSeventhPart from "./LandingPageSeventhPart";
import LandingPageSixthPart from "./LandingPageSixthPart";
import LandingPageThirdPart from "./LandingPageThirdPart";

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
            <LandingPageFourthPart />
            <LandingPageFifthPart />
            <LandingPageSixthPart />
            <LandingPageSeventhPart />
            <LandingPageEighthPart/>
        </div>
    );
};

export default LandingPage;
