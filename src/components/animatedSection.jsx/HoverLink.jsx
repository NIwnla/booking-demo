import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';

const HoverLink = ({ to, children, fontSize = '2rem', color = 'white' }) => {
    return (
        <Link
            to={to}
            style={{
                color: color,
                marginBottom: '2rem',
                fontSize: fontSize,
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'bold',
                textDecoration: 'none',
                transition: 'transform 0.3s ease',
                position: 'relative',
                width: 'fit-content'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(20px)';
                // @ts-ignore
                e.currentTarget.querySelector('.arrow').style.opacity = '1';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                // @ts-ignore
                e.currentTarget.querySelector('.arrow').style.opacity = '0';
            }}
        >
            <span className="arrow" style={{
                position: 'absolute',
                left: '-30px',
                opacity: 0,
                transition: 'opacity 0.3s ease'
            }}>
                <ArrowRightOutlined />
            </span>
            {children}
        </Link>
    );
};

export default HoverLink;