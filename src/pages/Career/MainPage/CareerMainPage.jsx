import React from 'react';
import Landing from './Landing';
import AllJobs from './AllJobs';
import CareerPath from './CareerPath';
import LifeAt from './LifeAt';
import Contact from './Contact';

const CareerMainPage = () => {
    return (
        <div>
            <Landing />
            <AllJobs />
            <CareerPath />
            <LifeAt />
            <Contact />
        </div>
    );
};

export default CareerMainPage;