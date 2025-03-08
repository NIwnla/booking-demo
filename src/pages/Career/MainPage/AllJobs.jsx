import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Tag } from 'antd';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../service/axios';
import { routeNames } from '../../../constaints/routeName';

const { Title, Text } = Typography;

const AllJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axiosInstance.get('job-offers');
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '4rem 10vw',
            position: 'relative',
            zIndex: 1
        }}>
            <Title style={{ marginBottom: '3rem', textAlign: 'center', fontSize: '3rem' }}>
                All Jobs
            </Title>

            <div>
                {jobs.map((job, index) => (
                    <Link
                        to={`${routeNames.career.detail.default}/${job.id}`}
                        style={{
                            transition: 'opacity 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.5'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        <Row
                            key={job.id}
                            style={{
                                borderBottom: '3px solid #e8e8e8',
                                padding: '1rem 0',
                                alignItems: 'center'
                            }}
                        >
                            <Col span={8}>
                                <Title style={{ margin: 0, fontSize: '2rem' }}>
                                    {job.nameEN}
                                </Title>
                            </Col>
                            <Col span={12}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div >
                                        <Text style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                            {job.shortDescription}
                                        </Text>
                                    </div>
                                    <div>
                                        <Tag color={job.isFullTime ? 'blue' : 'orange'} style={{ fontSize: '1rem' }}>
                                            {job.isFullTime ? 'Full Time' : 'Part Time'}
                                        </Tag>
                                    </div>

                                </div>
                            </Col>
                            <Col span={4} style={{ textAlign: 'right' }}>
                                <Text
                                    style={{
                                        color: '#1890ff',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Apply Now
                                </Text>
                            </Col>
                        </Row>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AllJobs;