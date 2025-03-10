import { Typography, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const careerPaths = [
    {
        title: "Software Development",
        description: "Start your journey as a Junior Developer and grow into a Technical Lead. Master various programming languages, frameworks, and architectural patterns. Lead innovative projects and mentor future developers.",
        color: "#E6F4FF",
        activeColor: "#BAE0FF"
    },
    {
        title: "Data Science",
        description: "Begin as a Data Analyst and progress to Data Science Manager. Develop expertise in machine learning, statistical analysis, and big data technologies. Drive data-driven decision making across the organization.",
        color: "#F6FFED",
        activeColor: "#B7EB8F"
    },
    {
        title: "Product Management",
        description: "Start as a Product Analyst and advance to Senior Product Manager. Develop product strategy, conduct market research, and lead cross-functional teams. Shape the future of our products and user experience.",
        color: "#FFF7E6",
        activeColor: "#FFD591"
    },
    {
        title: "UX/UI Design",
        description: "Begin as a Junior Designer and grow into a Design Director. Master user research, interaction design, and visual communication. Create intuitive and beautiful experiences that delight users.",
        color: "#F9F0FF",
        activeColor: "#D3ADF7"
    }
];

const CareerPath = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
    const [hoverStates, setHoverStates] = useState({ block1: false, block2: false });

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ padding: '4rem 0', backgroundColor: 'white', position: 'relative', zIndex: 1 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                Career Path
            </Title>

            {isLargeScreen ? (
                // Original vertical layout
                <div style={{
                    minHeight: '50rem',
                    display: 'flex',
                    gap: '1rem',
                    height: '300px',
                    padding: '1rem'
                }}>
                    {careerPaths.map((path, index) => (
                        <div
                            key={index}
                            style={{
                                background: index === activeIndex ? path.activeColor : path.color,
                                padding: index === activeIndex ? '2rem' : '1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.5s ease',
                                flex: index === activeIndex ? '1 1 100%' : '0 0 7%',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                justifyContent: index === activeIndex ? 'flex-end' : 'center'
                            }}
                            onClick={() => setActiveIndex(index)}
                        >
                            {/* Vertical title for inactive state */}
                            <Title
                                level={4}
                                style={{
                                    whiteSpace: 'nowrap',
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'rotate(90deg) translateX(-50%)',
                                    transformOrigin: 'center left',
                                    fontSize: '2rem',
                                    opacity: index === activeIndex ? 0 : 1,
                                    transition: 'opacity 0.3s ease',
                                    visibility: index === activeIndex ? 'hidden' : 'visible'
                                }}
                            >
                                {path.title}
                            </Title>

                            {/* Content for active state */}
                            <div style={{
                                opacity: index === activeIndex ? 1 : 0,
                                transition: 'opacity 0.3s ease',
                                visibility: index === activeIndex ? 'visible' : 'hidden'
                            }}>
                                <Title
                                    level={4}
                                    style={{
                                        marginBottom: '1rem',
                                        fontSize: '2rem'
                                    }}
                                >
                                    {path.title}
                                </Title>
                                <Paragraph
                                    style={{
                                        margin: 0,
                                        fontSize: '1.5rem',
                                        width: '40rem'
                                    }}
                                >
                                    {path.description}
                                </Paragraph>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Mobile vertical layout
                <div style={{
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                    padding: '1rem',
                    marginBottom: '2rem',
                    minHeight: '50vh'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {careerPaths.map((path, index) => (
                            <div
                                key={index}
                                style={{
                                    background: index === activeIndex ? path.activeColor : path.color,
                                    padding: '1.5rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    minHeight: index === activeIndex ? '350px' : '40px',
                                    overflow: 'hidden'
                                }}
                                onClick={() => setActiveIndex(index)}
                            >
                                <Title
                                    level={4}
                                    style={{
                                        margin: 0,
                                        fontSize: '1.5rem',
                                        transition: 'margin 0.3s ease'
                                    }}
                                >
                                    {path.title}
                                </Title>
                                <Paragraph
                                    style={{
                                        margin: 0,
                                        fontSize: '1rem',
                                        marginTop: index === activeIndex ? '1rem' : 0,
                                        opacity: index === activeIndex ? 1 : 0,
                                        transition: 'all 0.3s ease',
                                        height: index === activeIndex ? 'auto' : 0
                                    }}
                                >
                                    {path.description}
                                </Paragraph>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div style={{ padding: '5px 1vw' }}>
                <Row gutter={[8, 4]}>
                    <Col xs={24} lg={14}>
                        <div style={{
                            background: '#f0f2f5',
                            padding: '2rem',
                            height: '100%',
                            minHeight: '40vh'
                        }}>
                            Video
                        </div>
                    </Col>
                    <Col xs={24} lg={10}>
                        <Row gutter={[4, 4]}>
                            <Col xs={16} lg={24}>
                                <div
                                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, block1: true }))}
                                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, block1: false }))}
                                    style={{
                                        background: '#1677FF',
                                        padding: '2rem',
                                        paddingBottom: isLargeScreen ? '2rem' : '1rem',
                                        minHeight: isLargeScreen ? '20rem' : '100%',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-start',
                                        color: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}>

                                    <RightOutlined style={{
                                        position: 'absolute',
                                        top: isLargeScreen ? '2rem' : '1rem',
                                        right: '2rem',
                                        fontSize: isLargeScreen ? '1.5rem' : '0.75rem',
                                        transform: hoverStates.block1 ? 'translateX(10px)' : 'none',
                                        transition: 'all 0.3s ease'
                                    }} />
                                    <Title style={{
                                        margin: 0,
                                        fontSize: isLargeScreen ? '2rem' : '1.5rem',
                                        color: hoverStates.block1 ? 'lightgray' : 'white',
                                        transition: 'color 0.3s ease'
                                    }}>HR Orientation Training</Title>
                                    <Paragraph style={{
                                        fontWeight: 600,
                                        margin: '0.5rem 0 0 0',
                                        fontSize: isLargeScreen ? '1rem' : '0.75rem',
                                        color: hoverStates.block1 ? 'lightgray' : 'white',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        What is the orientation training session full of excitement and excitement by the diversity of new Partners? To start a new journey at Pizza 4P's, a clear orientation and roadmap for Partners is what we 4P's always aim for.
                                    </Paragraph>
                                </div>
                            </Col>
                            <Col xs={8} lg={24}>
                                <div
                                    onMouseEnter={() => setHoverStates(prev => ({ ...prev, block2: true }))}
                                    onMouseLeave={() => setHoverStates(prev => ({ ...prev, block2: false }))}
                                    style={{
                                        background: '#FA8C16',
                                        padding: '2rem',
                                        paddingBottom: isLargeScreen ? '2rem' : '1rem',
                                        minHeight: isLargeScreen ? '20rem' : '10rem',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-start',
                                        color: 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}>

                                    <RightOutlined style={{
                                        position: 'absolute',
                                        top: isLargeScreen ? '2rem' : '1rem',
                                        right: '2rem',
                                        fontSize: isLargeScreen ? '1.5rem' : '0.75rem',
                                        transform: hoverStates.block2 ? 'translateX(10px)' : 'none',
                                        transition: 'all 0.3s ease'
                                    }} />
                                    <Title style={{
                                        margin: 0,
                                        fontSize: isLargeScreen ? '2rem' : '1.5rem',
                                        color: hoverStates.block2 ? 'lightgray' : 'white',
                                        transition: 'color 0.3s ease'
                                    }}>Interview tip at 4Ps</Title>
                                    <Paragraph style={{
                                        fontWeight: 600,
                                        margin: '0.5rem 0 0 0',
                                        fontSize: isLargeScreen ? '1rem' : '0.75rem',
                                        color: hoverStates.block2 ? 'lightgray' : 'white',
                                        transition: 'color 0.3s ease'
                                    }}>
                                        Beautiful notes for you to get out of the interview to become a Pizza 4P's home partner in just one note, how？？？
                                    </Paragraph>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </div >
    );
};

export default CareerPath;