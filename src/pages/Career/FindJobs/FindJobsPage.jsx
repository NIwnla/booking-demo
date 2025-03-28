import { RightOutlined } from '@ant-design/icons';
import { Button, Col, Row, Spin, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import axiosInstance from '../../../service/axios';
import CareerNavBar from '../components/CareerNavBar';
import JobSearchBar from '../components/JobSearchBar';
import { Helmet } from 'react-helmet-async';

const { Title } = Typography;


const FindJobsPage = () => {
    const location = useLocation();
    const [searchValue, setSearchValue] = useState(location.state?.search || '');
    const [selectedWhat, setSelectedWhat] = useState(null);
    const [selectedWhatId, setSelectedWhatId] = useState(location.state?.type || null);
    const [selectedWhere, setSelectedWhere] = useState(location.state?.location || null);
    const [jobTypes, setJobTypes] = useState([]);
    const [jobOffers, setJobOffers] = useState([]);
    const { i18n } = useTranslation('global');
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const isLargeScreen = useMediaQuery({ minWidth: 992 });

    useEffect(() => {
        const fetchJobTypes = async () => {
            try {
                const response = await axiosInstance.get(apiEndPoints.JOB_TYPE.GET_ALL);
                setJobTypes(response.data);
            } catch (error) {
                console.error('Error fetching job types:', error);
            }
        };

        Promise.all([fetchJobTypes(), fetchJobOffers()])
            .finally(() => setIsLoading(false));
    }, []);

    const whatItems = {
        items: jobTypes.map(type => ({
            key: type.id,
            label: type.name,
            onClick: () => {
                setSelectedWhat(type.name);
                setSelectedWhatId(type.id);
            },
        })),
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

    const fetchJobOffers = async () => {
        setIsSearching(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.JOB_OFFER.GET_ALL, {
                params: {
                    search: searchValue,
                    typeId: selectedWhatId,
                }
            });
            setJobOffers(response.data);
        } catch (error) {
            console.error('Error fetching job offers:', error);
        } finally {
            setIsSearching(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#fff'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Find Jobs - Nollowa Chicken Careers</title>
                <meta name="description" content="Browse and search for job opportunities at Nollowa Chicken" />
            </Helmet>
            <div style={{ minHeight: '100vh' }}>
                <CareerNavBar selected="find-jobs" isLargeScreen={isLargeScreen} />

                <div style={{ padding: '225px 10vw' }}>
                    <Title level={1} style={{ marginBottom: '4rem', textAlign: 'center' }}>Find Jobs</Title>

                    <JobSearchBar
                        searchValue={searchValue}
                        onSearchChange={(e) => setSearchValue(e.target.value)}
                        whatItems={whatItems}
                        whereItems={whereItems}
                        selectedWhat={selectedWhat}
                        selectedWhatId={selectedWhatId}
                        selectedWhere={selectedWhere}
                        onSearch={fetchJobOffers}
                        isSearching={isSearching}
                        isLargeScreen={isLargeScreen}
                    />

                    <Row gutter={[isLargeScreen ? 64 : 16, isLargeScreen ? 64 : 16]} style={{ marginTop: '32px' }}>
                        {isSearching ? (
                            <Col span={24} style={{ textAlign: 'center', padding: '2rem' }}>
                                <Spin size="large" />
                            </Col>
                        ) : (
                            jobOffers.map(job => (
                                <Col xs={24} lg={8} key={job.id}>
                                    <div style={{
                                        background: '#FAF3E7',
                                        padding: '2rem 2rem',
                                        borderRadius: '8px',
                                        height: '100%',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                    }}
                                        onClick={() => navigate(`/career/detail/${job.id}`)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#1a365d';
                                            e.currentTarget.style.color = 'white';
                                            // @ts-ignore
                                            e.currentTarget.querySelector('.arrow-icon').style.transform = 'translateX(10px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#FAF3E7';
                                            e.currentTarget.style.color = 'inherit';
                                            // @ts-ignore
                                            e.currentTarget.querySelector('.arrow-icon').style.transform = 'translateX(0)';
                                        }}
                                    >
                                        <div
                                            className="arrow-icon"
                                            style={{
                                                position: 'absolute',
                                                top: '1.5rem',
                                                right: '1.5rem',
                                                fontSize: '1.5rem',
                                                transition: 'transform 0.3s ease'
                                            }}
                                        >
                                            <RightOutlined />
                                        </div>
                                        <p style={{
                                            marginTop: '3rem',
                                            marginBottom: '12px',
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            color: 'inherit',
                                        }}>
                                            {i18n.language === 'vi' ? job.nameVN : job.nameEN}
                                        </p>

                                        <p style={{
                                            marginBottom: '16px',
                                            fontSize: '1rem',
                                            lineHeight: '1.5715',
                                            fontWeight: '600',
                                            color: 'inherit',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}>
                                            {job.shortDescription}
                                        </p>
                                        <Tag color={job.isFullTime ? 'blue' : 'orange'}>
                                            {job.isFullTime ? 'Full Time' : 'Part Time'}
                                        </Tag>
                                    </div>
                                </Col>
                            )
                            ))}
                    </Row>
                </div>
                <div style={{ padding: '4rem 7vw', backgroundColor: 'white', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        borderTop: '1px solid #ddd',
                        borderBottom: '1px solid #ddd',
                        padding: '3rem 0',
                        textAlign: 'center'
                    }}>
                        <Title level={2} style={{ marginBottom: '2rem' }}>
                            For Career
                        </Title>
                        <div style={{
                            fontSize: '1.2rem',
                            color: '#666',
                            marginBottom: '2rem'
                        }}>
                            email@nollowaChicken.com
                        </div>
                        <Button
                            type="primary"
                            shape="round"
                            size="large"
                            style={{
                                backgroundColor: 'red',
                                borderColor: 'red',
                                minWidth: '150px',
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
                            Contact Us
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FindJobsPage;