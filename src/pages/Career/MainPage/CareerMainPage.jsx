import React from 'react';
import Landing from './Landing';
import AllJobs from './AllJobs';
import CareerPath from './CareerPath';
import LifeAt from './LifeAt';
import Contact from './Contact';
import { Helmet } from 'react-helmet-async';

const CareerMainPage = () => {
    return (
        <>
            <Helmet>
                <title>Careers - Nollowa Chicken</title>
                <meta name="description" content="Join our team at Nollowa Chicken and explore career opportunities" />
            </Helmet>
            <div>
                <Landing />
                <AllJobs />
                <CareerPath />
                <LifeAt />
                <Contact />
            </div>
        </>
    );
};

export default CareerMainPage;