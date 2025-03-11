import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LandingPageLoading from "../../../components/loadings/LandingPageLoading";
import { AuthContext } from "../../../context/AuthContext";
import Landing from "./Landing";
import LandingPageEighthPart from "./LandingPageEighthPart";
import LandingPageFifthPart from "./LandingPageFifthPart";
import LandingPageFourthPart from "./LandingPageFourthPart";
import LandingPageSeventhPart from "./LandingPageSeventhPart";
import LandingPageSixthPart from "./LandingPageSixthPart";
import Library from "./Library";
import LocationAndMenu from "./LocationAndMenu";

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
            <LandingPageFourthPart />
            <LandingPageFifthPart />
            <LandingPageSixthPart />
            <LandingPageSeventhPart />
            <LandingPageEighthPart/>
        </div>
    );
};

export default LandingPage;
