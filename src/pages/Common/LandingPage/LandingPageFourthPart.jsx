import React from 'react';
import { Button, Typography } from 'antd';

const { Title, Text } = Typography;

const LandingPageFourthPart = () => {
    return (
        <div style={{ height: '50vh', backgroundColor: 'gray', position: 'relative', zIndex: 1 }}>
            {/* Title and Button at top left */}
            <div style={{ position: 'absolute', top: '1vh', left: '1vw' }}>
                <Title style={{ color: 'white', fontSize: '7vw', width: '60vw', margin: 0 }}>
                    Sustainability Report
                    <Button
                        shape="circle"
                        style={{
                            height: '6vw',
                            width: '12vw',
                            position: 'absolute',
                            bottom: '2%',
                            marginLeft: '2vw',
                            backgroundColor: 'white',
                            color: 'red',
                            transition: 'background-color 0.3s ease, color 0.3s ease',  // Adding transition for smooth hover effect
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'red';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = 'red';
                        }}
                    >
                        <p style={{ fontSize: '1.5vw', margin: 0 }}>View <br />Report</p>
                    </Button>

                </Title>
            </div>



            {/* Text at bottom right */}
            <Text style={{ position: 'absolute', bottom: '1vh', right: '1vw', color: 'white', fontSize: '2.5vw', width: '40vw' }}>
                This report showcases our dedication to the environment and society.
            </Text>
        </div>
    );
};

export default LandingPageFourthPart;
