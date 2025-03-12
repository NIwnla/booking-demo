import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LandingPageLoading from "../../../components/loadings/LandingPageLoading";
import { AuthContext } from "../../../context/AuthContext";
import FollowSocialMedia from "./FollowSocialMedia";
import Landing from "./Landing";
import Library from "./Library";
import LocationAndMenu from "./LocationAndMenu";
import News from "./News";
import OriginalProduct from "./OriginalProduct";
import OurVision from "./OurVision";
import SustainabilityReport from "./SustainabilityReport";

const LandingPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const { role, setAuthToken } = useContext(AuthContext);
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    useEffect(() => {
        if (token) {
            setAuthToken(token);
        }
    }, [token, setAuthToken]);


    return (
        <div>
            <LandingPageLoading loading={loading} />
            <Landing />
            <LocationAndMenu />
            <Library />
            <SustainabilityReport />
            <FollowSocialMedia />
            <OurVision />
            <OriginalProduct />
            <News/>
        </div>
    );
};

export default LandingPage;
