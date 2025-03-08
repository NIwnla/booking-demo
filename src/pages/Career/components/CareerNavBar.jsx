import React from 'react';
import { Link } from 'react-router-dom';

const CareerNavBar = ({ selected }) => {
    const linkStyle = {
        color: 'red',
        textDecoration: 'none',
        padding: '1rem 2rem',
        fontSize: '1.2rem',
        transition: 'all 0.3s ease'
    };

    const selectedStyle = {
        ...linkStyle,
        borderBottom: '3px solid red'
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'start',
            padding: '0 1rem',
            background: 'rgb(255, 255, 255)',
            position: 'absolute',
            width: '100%',
            zIndex: 1,
            top: 70,
            borderTop: '1px solid rgb(255, 0, 0)',
            borderBottom: '1px solid rgb(255, 0, 0)',
        }}>
            <Link
                to="/career"
                style={selected === 'career' ? selectedStyle : linkStyle}
            >
                Career
            </Link>
            <Link
                to="/about"
                style={selected === 'about' ? selectedStyle : linkStyle}
            >
                About
            </Link>
            <Link
                to="/find-jobs"
                style={selected === 'find-jobs' ? selectedStyle : linkStyle}
            >
                Find Jobs
            </Link>
        </nav>
    );
};

export default CareerNavBar;