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
import { Helmet } from 'react-helmet-async';

const LandingPage = () => {
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return (
        <>
            <Helmet>
                <title>Welcome to Nollowa Chicken</title>
                <meta name="description" content="Welcome to Nollowa Chicken - Experience the best Korean fried chicken" />
            </Helmet>

            <div style={{ maxWidth: '100vw' }}>
                <LandingPageLoading loading={loading} />
                <Landing />
                <LocationAndMenu />
                <Library />
                <SustainabilityReport />
                <FollowSocialMedia />
                <OurVision />
                <OriginalProduct />
                <News />
            </div>
        </>
    );
};

export default LandingPage;
