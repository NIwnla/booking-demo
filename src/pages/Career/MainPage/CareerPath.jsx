import React, { useState } from 'react';
import { Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

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

    return (
        <div style={{ padding: '4rem 0', backgroundColor: 'white', position: 'relative', zIndex: 1 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>
                Career Path
            </Title>

            <div style={{
                minHeight:'50rem',
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
                                    width:'40rem'
                                }}
                            >
                                {path.description}
                            </Paragraph>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CareerPath;