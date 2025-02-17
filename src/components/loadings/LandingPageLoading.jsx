import React, { useEffect, useState } from "react";
// @ts-ignore
import loadingIcon from './../../assets/LoadingIcon.png';

const LandingPageLoading = ({ loading }) => {
    const [visible, setVisible] = useState(loading);
    const [dots, setDots] = useState(1);


    useEffect(() => {
        if (!loading) {
            setTimeout(() => setVisible(false), 300);
        } else {
            setVisible(true);
        }
    }, [loading]);

    useEffect(() => {
        let dotInterval;
        if (loading) {
            dotInterval = setInterval(() => {
                setDots((prevDots) => (prevDots === 3 ? 1 : prevDots + 1));
            }, 500); // Change dots every 500ms
        } else {
            clearInterval(dotInterval);
        }

        return () => clearInterval(dotInterval); // Clean up on component unmount
    }, [loading]);

    if (!visible) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgb(255, 255, 255)",
            display: "flex",
            flexDirection: 'column',
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            opacity: loading ? 1 : 0,
            visibility: loading ? "visible" : "hidden",
            transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
        }}>
            <img
                src={loadingIcon}
                alt="Loading image..."
                style={{
                    animation: "upDown 1s infinite alternate",
                }}
            />
            <p style={{ fontSize: '1vw', marginTop: '10px', color:'rgba(223,70,58,255)' }}>
                Loading{'.'.repeat(dots)}
            </p>
            <style>
                {`
                @keyframes upDown {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(-20px); /* Moves 20px up and down */
                    }
                }
                `}
            </style>
        </div>
    );
};

export default LandingPageLoading;
