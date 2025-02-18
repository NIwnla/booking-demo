import React from "react";
// @ts-ignore
import video from "../../../assets/LandingPageVideo.mp4";

const LandingPageFirstPart = () => {
    return (
        <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
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
                {["Branch 1", "Branch 2", "Branch 3", "Branch 4"].map((branch, index) => (
                    <a
                        key={index}
                        href={`#${branch.replace(" ", "").toLowerCase()}`}
                        style={{
                            color: "white",
                            fontSize: "3vw",
                            textDecoration: "none",
                            fontWeight: "bold",
                            transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(211, 13, 13, 0.86)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
                    >
                        {branch}
                    </a>
                ))}
            </div>
        </div>
    )

}

export default LandingPageFirstPart;