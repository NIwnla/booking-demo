import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../service/axios';
import { routeNames } from '../../../constaints/routeName';

const { Title, Text } = Typography;

const AllJobs = () => {
    const { t, i18n } = useTranslation('global');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

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

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if(loading) return <div>{t('career.allJobs.loading')}</div>;

    return (
        <div style={{
            backgroundColor: 'white',
            padding: isLargeScreen ? '4rem 8rem' : '4rem 2rem',
            position: 'relative',
            zIndex: 1
        }}>
            <Title style={{ marginBottom: '3rem', textAlign: 'center', fontSize: '3rem' }}>
                {t('career.allJobs.title')}
            </Title>

            <div>
                {jobs.map((job, index) => (
                    <Link
                        key={job.id}
                        to={`${routeNames.career.detail}${job.id}`}
                        style={{
                            transition: 'opacity 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.5'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        <Row
                            gutter={[16, 16]}
                            style={{
                                borderTop: index === 0 ? '2px solid rgb(12, 2, 2)' : 'none',
                                borderBottom: '2px solid rgb(12, 2, 2)',
                                padding: '1rem 0',
                                alignItems: 'center'
                            }}
                        >
                            <Col xs={24} lg={8}>
                                <Title style={{ margin: 0, fontSize: '1.5rem' }}>
                                    {i18n.language === 'en' ? job.nameEN : job.nameVN}
                                </Title>
                            </Col>
                            <Col xs={24} lg={12}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <Text style={{ fontSize: '1rem', fontWeight: '500' }}>
                                            {job.shortDescription}
                                        </Text>
                                    </div>
                                    <div>
                                        <Tag color={job.isFullTime ? 'blue' : 'orange'} style={{ fontSize: '1rem' }}>
                                            {t(`career.allJobs.jobTypes.${job.isFullTime ? 'fullTime' : 'partTime'}`)}
                                        </Tag>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} lg={4} style={{ textAlign: 'right' }}>
                                <Text
                                    style={{
                                        color: '#1890ff',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {t('career.allJobs.applyNow')}
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