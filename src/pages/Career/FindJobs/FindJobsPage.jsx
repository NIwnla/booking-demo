import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Typography, Tag, Button, Spin } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../service/axios';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import CareerNavBar from '../components/CareerNavBar';
import CustomDropdown from '../components/CustomDropdown';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;


const FindJobsPage = () => {
    const location = useLocation();
    const [searchValue, setSearchValue] = useState(location.state?.search || '');
    const [selectedWhat, setSelectedWhat] = useState(location.state?.type || null);
    const [selectedWhere, setSelectedWhere] = useState(location.state?.location || null);
    const [jobTypes, setJobTypes] = useState([]);
    const [jobOffers, setJobOffers] = useState([]);
    const { i18n } = useTranslation('global');
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

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
            onClick: () => setSelectedWhat(type.name),
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
                    typeId: selectedWhat,
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
        <div style={{ minHeight: '100vh' }}>
            <CareerNavBar selected="find-jobs" />

            <div style={{ padding: '225px 10vw' }}>
                <Title level={1} style={{ marginBottom: '4rem', textAlign: 'center' }}>Find Jobs</Title>

                <Row style={{ marginBottom: '24px' }}>
                    <Col span={6}>
                        <Input
                            placeholder="Search jobs..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{
                                fontSize: '2rem',
                                borderRadius: '24px 0 0 24px',
                                border: '2px solid rgb(0, 0, 0)',
                                height: '100%',
                            }}
                        />
                    </Col>
                    <Col span={6}>
                        <div style={{
                            border: '2px solid rgb(0, 0, 0)',
                            borderLeft: 'none',
                            padding: '0 1rem',
                            height: '100%'
                        }}>
                            <CustomDropdown
                                menu={whatItems}
                                value={selectedWhat}
                                placeholder="What"
                            />
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{
                            border: '2px solid rgb(0, 0, 0)',
                            borderLeft: 'none',
                            padding: '0 1rem',
                            height: '100%'
                        }}>
                            <CustomDropdown
                                menu={whereItems}
                                value={selectedWhere}
                                placeholder="Where"
                            />
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{ width: "100%", height: '100%' }}>
                            <Button
                                type="primary"
                                loading={isSearching}
                                style={{
                                    width: '100%',
                                    borderRadius: '0 24px 24px 0',
                                    fontSize: '2rem',
                                    border: 'none',
                                    background: '#1a365d',
                                    height: '100%'
                                }}
                                onClick={fetchJobOffers}
                            >
                                {isSearching ? 'Searching...' : 'Search Jobs'}
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Row gutter={[64, 64]} style={{ marginTop: '32px' }}>
                    {isSearching ? (
                        <Col span={24} style={{ textAlign: 'center', padding: '2rem' }}>
                            <Spin size="large" />
                        </Col>
                    ) : (
                        jobOffers.map(job => (
                            <Col md={24} lg={8} key={job.id}>
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
        </div>
    );
};

export default FindJobsPage;