import { Typography, Row, Col, Button, Carousel, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
// @ts-ignore
import sampleImage from '../../../assets/LoadingIcon.png';
import { useInView } from 'react-intersection-observer';
import TypedText from './components/TypedText';

const { Title, Paragraph } = Typography;

const LifeAt = () => {
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

    const [refDelivering, inViewDelivering] = useInView({ triggerOnce: true });
    const [refWow, inViewWow] = useInView({ triggerOnce: true });
    const [refSharing, inViewSharing] = useInView({ triggerOnce: true });
    const [refHappiness, inViewHappiness] = useInView({ triggerOnce: true });

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const items = [
        { image: sampleImage, tag: "Culture", date: "Jan 1, 2024", title: "4P's Culture Day" },
        { image: sampleImage, tag: "Event", date: "Feb 15, 2024", title: "Team Building Event" },
        { image: sampleImage, tag: "Training", date: "Mar 20, 2024", title: "Leadership Workshop" },
        { image: sampleImage, tag: "Welfare", date: "Apr 5, 2024", title: "Employee Benefits Update" },
    ];

    return (
        <div style={{ padding: '4rem 0', backgroundColor: 'white', position: 'relative', zIndex: 1 }}>
            <div style={{ padding: '0 7vw', marginBottom: '3rem' }}>
                <Row align="middle" gutter={[32, 16]}>
                    <Col xs={24} lg={16}>
                        <Title level={2} style={{ margin: 0 }}>Life at 4P's</Title>
                        <Paragraph style={{ fontSize: '1.1rem', margin: '1rem 0 0 0' }}>
                            Here are some articles help you with thinking about your career plan at 4P's.
                            We'd like to introduce various welfare benefits and training programs, as well as
                            events where you can experience the 4P's vision and values.
                        </Paragraph>
                    </Col>
                    <Col xs={24} lg={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            shape="round"
                            size="large"
                            style={{
                                backgroundColor: 'red',
                                borderColor: 'red',
                                minWidth: '120px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.color = 'red';
                                e.currentTarget.style.borderColor = 'red';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'red';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.borderColor = 'red';
                            }}
                        >
                            View More
                        </Button>
                    </Col>
                </Row>
            </div>

            <div style={{ padding: '0 7vw' }}>
                <Carousel
                    slidesToShow={isLargeScreen ? 3 : 1}
                    style={{ marginTop: '2rem' }}
                >
                    {items.map((item, index) => (
                        <div key={index}>
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    style={{
                                        width: '80%',
                                        height: '300px',
                                        objectFit: 'cover',
                                        border: '1px solid #ddd',
                                    }}
                                />
                                <Tag
                                    color="red"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        padding: '4px 12px',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {item.tag}
                                </Tag>
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <Paragraph style={{ color: 'gray', margin: '0' }}>{item.date}</Paragraph>
                                <Title level={4} style={{ margin: '0.5rem 0' }}>{item.title}</Title>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>

            <div
                style={{
                    backgroundImage: `url(${sampleImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '50rem',
                    margin: '2rem 7vw',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    const centerX = 50;
                    const centerY = 50;
                    const offsetX = (x - 0.5) * 15;
                    const offsetY = (y - 0.5) * 15;
                    e.currentTarget.style.backgroundPosition = `${centerX - offsetX}% ${centerY - offsetY}%`;
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                }}>
                    <div
                        ref={refDelivering}
                        style={{
                            fontSize: '6rem',
                            marginBottom: '1rem'
                        }}>
                        <TypedText text="Delivering" inView={inViewDelivering} delay={0} />
                    </div>
                    <div
                        ref={refWow}
                        style={{
                            fontSize: '7rem',
                            marginBottom: '1rem'
                        }}>
                        <TypedText text="Wow" inView={inViewWow} delay={0.5} />
                    </div>
                    <div
                        ref={refSharing}
                        style={{
                            fontSize: '6rem',
                            marginBottom: '1rem'
                        }}>
                        <TypedText text="Sharing" inView={inViewSharing} delay={1} />
                    </div>
                    <div
                        ref={refHappiness}
                        style={{
                            fontSize: '6rem',
                            marginBottom: '2rem'
                        }}>
                        <TypedText text="Happiness" inView={inViewHappiness} delay={1.5} />
                    </div>
                    <Button
                        type="primary"
                        shape="round"
                        size="large"
                        style={{
                            backgroundColor: 'red',
                            minWidth: '120px',
                            transition: 'all 0.3s ease',
                            color: 'white',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = 'black';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'red';
                            e.currentTarget.style.color = 'white';
                        }}
                    >
                        members
                    </Button>
                </div >
            </div >
        </div >
    );
};

export default LifeAt;