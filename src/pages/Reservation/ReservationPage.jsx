import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Row, Select, TimePicker } from 'antd';
import React, { useState } from 'react';
// @ts-ignore
import ReservationBackground from '../../assets/ReservationBackground.jpg';
import { Link } from 'react-router-dom';
import { routeNames } from '../../constaints/routeName';

const ReservationPage = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);

    const locations = [
        'Tay Ho',
        'Hoan Kiem',
        'Ba Dinh',
        'Dong Da',
        'Hai Ba Trung',
    ];

    const peopleOptions = Array.from({ length: 10 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1} ${i === 0 ? 'person' : 'people'}`,
    }));

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
    };

    return (
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
                filter: 'blur(6px)',
                zIndex: 0,
            }} />

            {/* Content Container */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '2rem 10vw',
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
                    Reserve a table at any of our restaurants in your city {selectedLocation}
                </p>
                <Row gutter={[16, 16]} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', width: '70vw' }}>
                    <Col xs={12} md={12} lg={5}>
                        <Select
                            placeholder="Select location"
                            style={{ width: '100%' }}
                            options={locations.map(loc => ({ value: loc, label: loc }))}
                            value={selectedLocation}
                            onChange={(value) => setSelectedLocation(value)}
                        />
                    </Col>
                    <Col xs={12} md={12} lg={5}>
                        <Select
                            placeholder="Number of people"
                            style={{ width: '100%' }}
                            options={peopleOptions}
                        />
                    </Col>
                    <Col xs={12} md={12} lg={5}>
                        <DatePicker style={{ width: '100%' }} />
                    </Col>
                    <Col xs={12} md={12} lg={5}>
                        <TimePicker 
                            style={{ width: '100%' }} 
                            format="HH:mm"
                            disabledTime={() => {
                                const now = new Date();
                                return {
                                    disabledHours: () => Array.from(
                                        { length: now.getHours() }, 
                                        (_, i) => i
                                    ),
                                    disabledMinutes: (selectedHour) => {
                                        if (selectedHour === now.getHours()) {
                                            return Array.from(
                                                { length: now.getMinutes() }, 
                                                (_, i) => i
                                            );
                                        }
                                        return [];
                                    }
                                };
                            }}
                        />
                    </Col>
                    <Col xs={24} md={12} lg={4}>
                        <Button type="primary" icon={<SearchOutlined />} style={{ width: '100%' }}>
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
                            key={location}
                            style={{
                                padding: '0.2rem',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                backgroundColor: selectedLocation === location ? '#ffcdd2' : 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textAlign: 'center',
                                fontSize: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={() => handleLocationSelect(location)}
                        >
                            {location}
                        </div>
                    ))}
                </div>

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
                <Link to={routeNames.reservation.form}> Form </Link>
            </div>
        </div>
    );
};

export default ReservationPage;
