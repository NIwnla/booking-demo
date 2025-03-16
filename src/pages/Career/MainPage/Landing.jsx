import { DownOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Input, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import CareerBackground from '../../../assets/LandingPageVideo.mp4';
import HoverLink from '../../../components/animatedSection.jsx/HoverLink';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import { routeNames } from '../../../constaints/routeName';
import axiosInstance from '../../../service/axios';
import CustomDropdown from '../components/CustomDropdown';
import JobSearchBar from '../components/JobSearchBar';

const { Title, Text } = Typography;

const Landing = () => {
    const { t } = useTranslation('global');
    const navigate = useNavigate();
    const [selectedWhat, setSelectedWhat] = useState(null);
    const [selectedWhatId, setSelectedWhatId] = useState(null);
    const [selectedWhere, setSelectedWhere] = useState(null);
    const [jobTypes, setJobTypes] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

    useEffect(() => {
        const fetchJobTypes = async () => {
            try {
                const response = await axiosInstance.get(apiEndPoints.JOB_TYPE.GET_ALL);
                setJobTypes(response.data);
            } catch (error) {
                console.error('Error fetching job types:', error);
            }
        };

        fetchJobTypes();
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
                label: t('career.landing.search.locations.hanoi'),
                onClick: () => setSelectedWhere(t('career.landing.search.locations.hanoi')),
            },
            {
                key: '2',
                label: t('career.landing.search.locations.hochiminh'),
                onClick: () => setSelectedWhere(t('career.landing.search.locations.hochiminh')),
            },
            {
                key: '3',
                label: t('career.landing.search.locations.danang'),
                onClick: () => setSelectedWhere(t('career.landing.search.locations.danang')),
            },
        ],
    };

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                    fontSize: '6rem',
                    marginBottom: '2rem'
                }}>
                    {t('career.landing.title')}
                </Title>
                <HoverLink to="/about" fontSize="2rem" color="white">
                    {t('career.landing.links.aboutUs')}
                </HoverLink>
                <HoverLink to={routeNames.career.findJobs} fontSize="2rem" color="white">
                    {t('career.landing.links.findJobs')}
                </HoverLink>
            </div>

            {isLargeScreen ? (
                <div style={{
                    position: 'absolute',
                    zIndex: 2,
                    padding: '2rem',
                    width: '30rem',
                    right: '3vw',
                    bottom: '2vh',
                }}>
                    <Card
                        title={t('career.landing.search.title')}
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
                            placeholder={t('career.landing.search.searchPlaceholder')}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{
                                marginBottom: '1rem',
                                fontSize: '2rem',
                                border: 'none',
                                borderBottom: '3px solid black',
                                borderRadius: 0,
                            }}
                        />
                        <div style={{ borderBottom: '3px solid black', marginBottom: '1rem' }}>
                            <CustomDropdown
                                menu={whatItems}
                                value={selectedWhat}
                                valueId={selectedWhatId}
                                placeholder={t('career.landing.search.what')}
                            />
                        </div>
                        <div style={{ borderBottom: '3px solid black', marginBottom: '1.5rem' }}>
                            <CustomDropdown
                                menu={whereItems}
                                value={selectedWhere}
                                valueId={selectedWhatId}
                                placeholder={t('career.landing.search.where')}
                            />
                        </div>
                        <Button
                            type="link"
                            style={{ textDecoration: 'underline', fontSize: '1.5rem' }}
                            onClick={() => {
                                navigate(routeNames.career.findJobs, {
                                    state: {
                                        search: searchValue,
                                        type: selectedWhatId, // Changed from selectedWhat
                                        location: selectedWhere
                                    }
                                });
                            }}
                        >
                            {t('career.landing.search.button')}
                        </Button>
                    </Card>
                </div>
            ) : (
                <div style={{
                    position: 'absolute',
                    bottom: 100,
                    left: 0,
                    width: '100%',
                    padding: '1rem',
                    background: 'transparent',
                    zIndex: 2,
                }}>
                    <JobSearchBar
                        searchValue={searchValue}
                        onSearchChange={(e) => setSearchValue(e.target.value)}
                        whatItems={whatItems}
                        whereItems={whereItems}
                        selectedWhat={selectedWhat}
                        selectedWhatId={selectedWhatId}
                        selectedWhere={selectedWhere}
                        onSearch={() => {
                            navigate(routeNames.career.findJobs, {
                                state: {
                                    search: searchValue,
                                    type: selectedWhatId,
                                    location: selectedWhere
                                }
                            });
                        }}
                        isSearching={false}
                        isLargeScreen={isLargeScreen}
                    />
                </div>
            )}
        </div>
    );
};

export default Landing;