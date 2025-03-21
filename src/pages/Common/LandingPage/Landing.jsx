import React from "react";
import { useTranslation } from "react-i18next";
// @ts-ignore
import video from "../../../assets/LandingPageVideo.mp4";

const Landing = () => {
    const { t } = useTranslation('global');
    
    const branches = ['branch1', 'branch2', 'branch3', 'branch4'];

    return (
        <div style={{height: "100vh" }}>
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 0
                }}
            >
                <source src={video} type="video/mp4" />
                <img
                    src="https://via.placeholder.com/1920x1080"
                    alt="Fallback Background"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </video>

            {/* Overlay Content */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0.4)",
                    zIndex: 2
                }}
            >
            </div>

            {/* Branch Links at Bottom Left */}
            <div
                style={{
                    position: "absolute",
                    bottom: "3vh",
                    left: "3vw",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1vh",
                    zIndex: 2,
                }}
            >
                {branches.map((branch, index) => (
                    <a
                        key={index}
                        href={`#${branch.toLowerCase()}`}
                        style={{
                            color: "white",
                            fontSize: "3rem",
                            textDecoration: "none",
                            fontWeight: "bold",
                            transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(211, 13, 13, 0.86)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
                    >
                        {t(`landing.branches.${branch}`)}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Landing;