import { SearchOutlined } from '@ant-design/icons';
import { App, Button, Col, DatePicker, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import axiosInstance from '../../service/axios';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import ReservationBackground from '../../assets/ReservationBackground.jpg';
import { routeNames } from '../../constaints/routeName';
import dayjs from 'dayjs';
import { Helmet } from 'react-helmet-async';

const ReservationPage = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [branches, setBranches] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedAdult, setSelectedAdult] = useState(2);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const { message } = App.useApp();
    const navigate = useNavigate();

    const [isMiddleScreen, setIsMiddleScreen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMiddleScreen(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchBranches = async () => {
        setIsFetching(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.BRANCH.GET_ALL, {
                params: {
                    includeDeleted: true,
                    locationId: selectedLocation || null,
                }
            });
            setBranches(response.data);
        } catch (error) {
            message.error('Error fetching branches');
        } finally {
            setIsFetching(false);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await axiosInstance.get(apiEndPoints.BRANCH_LOCATION.GET_ALL);
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);


    const peopleOptions = Array.from({ length: 10 }, (_, i) => ({
        value: i + 2,
        label: `${i + 2} people`,
    }));

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
    };

    const handleReservationClick = (branch) => {
        navigate(routeNames.reservation.form, {
            state: {
                branch,
                time: selectedTime,
                adult: selectedAdult,
                date: selectedDate?.format('YYYY-MM-DD'),
            }
        });
    };

    return (
        <>
            <Helmet>
                <title>Table Reservation - Nollowa Chicken</title>
                <meta name="description" content="Reserve a table at your preferred Nollowa Chicken location" />
            </Helmet>
            <div style={{
                position: 'relative',
            }}>
                {/* Blurred Background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${ReservationBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(10px)',
                    zIndex: 0,
                }} />

                {/* Content Container */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: isMiddleScreen ? '2rem 10vw' : '2rem 2vw',
                    gap: '1.5rem',
                    position: 'relative',
                    backgroundColor: 'transparent',
                    minHeight: '100vh',
                }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        marginBottom: '0.5rem',
                        color: 'white',
                    }}>
                        Reservations
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'white',
                        marginBottom: '2rem'
                    }}>
                        Reserve a table at any of our restaurants in your city {locations.find(loc => loc.id === selectedLocation)?.name || ''}
                    </p>
                    <Row gutter={[16, 16]} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', width: '70vw' }}>
                        <Col xs={12} md={12} lg={7}>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                                Branch {locations.find(loc => loc.id === selectedLocation)?.name || ''}
                            </div>
                            <Select
                                placeholder="Select location"
                                style={{ width: '100%' }}
                                options={locations.map(loc => ({
                                    value: loc.id,
                                    label: loc.name
                                }))}
                                value={selectedLocation}
                                onChange={(value) => setSelectedLocation(value)}
                            />
                        </Col>
                        <Col xs={12} md={12} lg={5}>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                                Adult
                            </div>
                            <Select
                                placeholder="Number of people"
                                style={{ width: '100%' }}
                                options={peopleOptions}
                                value={selectedAdult}
                                onChange={setSelectedAdult}
                            />
                        </Col>
                        <Col xs={12} md={12} lg={5}>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                                Date
                            </div>
                            <DatePicker
                                style={{ width: '100%' }}
                                value={selectedDate}
                                onChange={setSelectedDate}
                            />
                        </Col>
                        <Col xs={12} md={12} lg={3}>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                                Time
                            </div>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Select time"
                                value={selectedTime}
                                onChange={setSelectedTime}
                                options={(() => {
                                    const now = new Date();
                                    const currentHour = now.getHours();
                                    const currentMinute = now.getMinutes();
                                    const times = [];

                                    for (let hour = 0; hour < 24; hour++) {
                                        for (let minute = 0; minute < 60; minute += 15) {
                                            // Skip times before current time
                                            if (hour < currentHour || (hour === currentHour && minute <= currentMinute)) {
                                                continue;
                                            }

                                            const formattedHour = hour.toString().padStart(2, '0');
                                            const formattedMinute = minute.toString().padStart(2, '0');
                                            const timeString = `${formattedHour}:${formattedMinute}`;

                                            times.push({
                                                value: timeString,
                                                label: timeString,
                                            });
                                        }
                                    }
                                    return times;
                                })()}
                            />
                        </Col>
                        <Col xs={24} lg={4} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                            <Button
                                type="primary"
                                loading={isFetching}
                                icon={<SearchOutlined />}
                                style={{ width: '100%' }}
                                onClick={() => fetchBranches()}
                                disabled={!selectedLocation || !selectedTime || !selectedAdult || !selectedDate}>
                                Search
                            </Button>
                        </Col>
                    </Row>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center', justifyContent: 'center', width: '60vw' }}>
                        <div style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>
                            Choose Location:
                        </div>
                        {locations.map((location) => (
                            <div
                                key={location.id}
                                style={{
                                    padding: '0.2rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    backgroundColor: selectedLocation === location.id ? '#ffcdd2' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => handleLocationSelect(location.id)}
                            >
                                {location.name}
                            </div>
                        ))}
                    </div>

                    {branches.length === 0 ? (
                        <>
                            <h2 style={{
                                fontSize: '1.8rem',
                                margin: '2rem 0 1rem',
                                textAlign: 'center',
                                color: 'white',
                            }}>
                                Find your table
                            </h2>
                            <h2 style={{
                                fontSize: '1.8rem',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                Or
                            </h2>
                            <div style={{
                                backgroundColor: '#f8f9fa',
                                padding: '1.5rem',
                                borderRadius: '8px',
                                marginTop: '0.5rem',
                                maxWidth: '800px',
                                width: '100%'
                            }}>
                                <p style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>
                                    For specific requests such as hosting large groups (15+ people), booking more than 30 days in advance,
                                    or choosing a preferred ambiance, please contact our 4P's Guest Service Center (09:00 - 22:00) via:
                                </p>
                                <p style={{ fontSize: '1rem', color: '#333', margin: 0 }}>
                                    Domestic number: <strong>1900 6043</strong><br />
                                    International number: <strong>(028) 3622 0500</strong>
                                </p>
                            </div>
                        </>
                    ) : (
                        <div style={{
                            borderTop: '2px solid white',
                            width: '100%'
                        }}>
                            <h2 style={{
                                fontSize: '1.8rem',
                                margin: '1rem 0',
                                textAlign: 'center',
                                color: 'white',
                            }}>
                                {branches.length} matching table found.  Click the desired time below to proceed.
                            </h2>
                            <p style={{
                                fontSize: '1rem',
                                color: 'white',
                                textAlign: 'center',
                                marginBottom: '1rem'
                            }}>
                                Available at {selectedTime}, {selectedDate?.format('DD-MM-YYYY')}, for {selectedAdult} adults.
                            </p>
                        </div>
                    )}

                    {branches.map((branch) => (
                        <div
                            key={branch.id}
                            style={{
                                backgroundColor: 'white',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '15px',
                                borderBottom: '1px solid #eee',
                                alignItems: 'flex-start',
                                fontSize: isMiddleScreen ? '2rem' : '1rem'
                            }}
                        >
                            <div style={{ flex: '1', width: '50%' }}>
                                <h3 style={{ margin: '0 0 10px 0' }}>{branch.nameEN}</h3>
                                <p style={{ margin: '0', color: '#666' }}>{branch.descriptionEN}</p>
                            </div>
                            <div
                                style={{
                                    padding: '5px',
                                    background: 'red',
                                    color: 'white',
                                    fontSize: isMiddleScreen ? '1.75rem' : '0.75rem',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleReservationClick(branch)}>
                                {selectedTime}
                            </div>
                        </div>
                    ))}


                </div>
            </div>
        </>
    );
};

export default ReservationPage;
