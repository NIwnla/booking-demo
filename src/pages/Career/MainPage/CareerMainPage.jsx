import { ArrowLeftOutlined, ArrowRightOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Input, Typography } from 'antd';
import React, { useState } from 'react';
// @ts-ignore
import CareerBackground from '../../../assets/LandingPageVideo.mp4';
import { Link, useNavigate } from 'react-router-dom';
import HoverLink from '../../../components/animatedSection.jsx/HoverLink';
const { Title, Text } = Typography;

const CareerMainPage = () => {
    const [selectedWhat, setSelectedWhat] = useState(null);
    const [selectedWhere, setSelectedWhere] = useState(null);
    const navigate = useNavigate();

    const whatItems = {
        items: [
            {
                key: '1',
                label: 'Full Time',
                onClick: () => setSelectedWhat('Full Time'),
            },
            {
                key: '2',
                label: 'Part Time',
                onClick: () => setSelectedWhat('Part Time'),
            },
        ],
    };

    const whereItems = {
        items: [
            {
                key: '1',
                label: 'Ha Noi',
                onClick: () => setSelectedWhere('Ha Noi'),
            },
            {
                key: '2',
                label: 'Ho Chi Minh',
                onClick: () => setSelectedWhere('Ho Chi Minh'),
            },
            {
                key: '3',
                label: 'Da Nang',
                onClick: () => setSelectedWhere('Da Nang'),
            },
        ],
    };
    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
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
                <source src={CareerBackground} type="video/mp4" />
                <img
                    src="https://via.placeholder.com/1920x1080"
                    alt="Fallback Background"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </video>

            {/* Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1
            }} />``

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                padding: '15vh 0 0 5vw',
                color: 'white'
            }}>
                <Title style={{
                    color: 'white',
                    fontSize: '8rem',
                    marginBottom: '4rem'
                }}>
                    Career
                </Title>
                <HoverLink to="/about" fontSize="2rem" color="white">About Us</HoverLink>
                <HoverLink to="/find-jobs" fontSize="2rem" color="white">Find Jobs</HoverLink>
            </div>

            <div style={{
                position: 'absolute',
                zIndex: 2,
                padding: '2rem',
                width: '30rem',
                right: '3vw',
                bottom: '2vh',
            }}>
                <Card
                    title="Find Jobs"
                    styles={{
                        header: {
                            textAlign: 'center',
                            fontSize: '2rem'
                        }
                    }}
                    style={{
                        background: 'rgb(255, 255, 255)',
                        borderRadius: '15px',
                        textAlign: 'center'
                    }}
                >
                    <Input
                        placeholder="Search..."
                        style={{
                            marginBottom: '1rem',
                            fontSize: '2rem',
                            border: 'none',
                            borderBottom: '3px solid rgb(252, 162, 162)',
                            borderRadius: 0,
                        }}
                    />
                    <div style={{ borderBottom: '3px solid rgb(252, 162, 162)', marginBottom: '1rem' }}>
                        <Dropdown menu={whatItems} trigger={['click']}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.5rem 0'
                            }}>
                                <Text style={{ margin: 0, fontSize: '2rem' }}>
                                    {selectedWhat || 'What'}
                                </Text>
                                <DownOutlined style={{ fontSize: '1.5rem' }} />
                            </div>
                        </Dropdown>
                    </div>
                    <div style={{ borderBottom: '3px solid rgb(252, 162, 162)', marginBottom: '1.5rem' }}>
                        <Dropdown menu={whereItems} trigger={['click']}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.5rem 0'
                            }}>
                                <Text style={{ margin: 0, fontSize: '2rem' }}>
                                    {selectedWhere || 'Where'}
                                </Text>
                                <DownOutlined style={{ fontSize: '1.5rem' }} />
                            </div>
                        </Dropdown>
                    </div>
                    <Button type="link" style={{ textDecoration: 'underline', fontSize: '1.5rem' }}>
                        Find Jobs
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default CareerMainPage;