import React, { useEffect, useState } from 'react';
import { Row, Col, DatePicker, Spin } from 'antd'; // Import Ant Design components
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LabelList, Line, LineChart } from 'recharts';
import axiosInstance from '../../service/axios';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import dayjs from 'dayjs';

const HomePageAdmin = () => {
    const [bookingFrequencyData, setBookingFrequencyData] = useState([]);
    const [bookingStatusData, setBookingStatusData] = useState([]);
    const [bookingDayTimeData, setBookingDayTimeData] = useState([]);
    const [bookingNightTimeData, setBookingNightTimeData] = useState([]);
    const [specifiedDate, setSpecifiedDate] = useState(dayjs());
    const [specifiedWeek, setSpecifiedWeek] = useState(dayjs().startOf('isoWeek'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const startDate = specifiedWeek.format('YYYY-MM-DD');
            const currentDate = specifiedDate.format('YYYY-MM-DD');
            setLoading(true);
            try {
                const response = await axiosInstance.get(apiEndPoints.DASHBOARD.ADMIN, {
                    params: {
                        startDate: startDate,
                        specifiedDate: currentDate,
                    },
                });
                setBookingFrequencyData(response.data.bookingFrequency);
                setBookingStatusData(response.data.bookingStatusCounts);
                setBookingDayTimeData(response.data.bookingDayTimeFrequency);
                setBookingNightTimeData(response.data.bookingNightTimeFrequency);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [specifiedDate, specifiedWeek]);

    // Handle date change
    const handleDateChange = (date) => {
        setSpecifiedDate(date);
    };

    const handleWeekChange = (date) => {
        setSpecifiedWeek(date.startOf('isoWeek'));
    };

    // Color for pie chart
    const COLORS = {
        Cancelled: '#FF0000', // Red
        Booking: '#FFA500', // Orange
        Confirmed: '#008000', // Green
    };

    return (
        <div style={{ padding: '1%' }}>
            <h2>Admin Dashboard</h2>

            {/* Container for Daytime and Nighttime Frequencies */}
            <div style={styles.chartContainer}>
                <h3>Booking Frequency by Time of Day</h3>

                {/* Date Picker */}
                <Row style={{ marginBottom: '24px' }}>
                    <Col span={24}>
                        <div
                            // @ts-ignore
                            style={styles.datePickerContainer}>
                            <h4>Select a Date</h4>
                            <DatePicker
                                value={specifiedDate}
                                onChange={handleDateChange}
                                style={{ width: '100%' }}
                            />
                            <p style={{ marginTop: '8px', fontSize: '14px' }}>
                                The graphs below display booking frequencies for both daytime and nighttime based on the selected date.
                            </p>
                        </div>
                    </Col>
                </Row>

                {/* Daytime and Nighttime Frequency Graphs */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <div>
                            <h4>Booking Daytime Frequency</h4>
                            <Spin spinning={loading}>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={bookingDayTimeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#82ca9d">
                                            <LabelList dataKey="count" position="top" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Spin>
                        </div>
                    </Col>

                    <Col xs={24} md={12}>
                        <div>
                            <h4>Booking Nighttime Frequency</h4>
                            <Spin spinning={loading}>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={bookingNightTimeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#ff7300">
                                            <LabelList dataKey="count" position="top" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Spin>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Weekly booking frequency and status ratio graph */}
            <div style={styles.chartContainer}>
                <Row style={{ marginBottom: '24px' }}>
                    <Col span={24}>
                        <div
                            // @ts-ignore
                            style={styles.datePickerContainer}
                        >
                            <h4>Select Week</h4>
                            <DatePicker
                                value={specifiedWeek}
                                picker="week"
                                onChange={handleWeekChange}
                                style={{ width: '100%' }}
                            />
                            <p style={{ marginTop: '8px', fontSize: '14px' }}>
                                The graphs below display weekly booking frequencies and status ratio.
                            </p>
                        </div>
                    </Col>
                </Row>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <h3>Booking Frequency</h3>
                        <Spin spinning={loading}>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={bookingFrequencyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" stroke="#8884d8">
                                        <LabelList dataKey="count" position="top" />
                                    </Line>
                                </LineChart>
                            </ResponsiveContainer>
                        </Spin>
                    </Col>

                    <Col xs={24} md={12}>
                        <h3>Booking Status Ratio</h3>
                        <Spin spinning={loading}>
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={bookingStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={150}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {bookingStatusData.map((entry) => (
                                            <Cell key={entry.name} fill={COLORS[entry.name] || '#8884d8'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Spin>
                    </Col>
                </Row>
            </div>
        </div >
    );
};

const styles = {
    chartContainer: {
        backgroundColor: '#fff',
        margin: '2% 1%',
        padding: '1%',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    datePickerContainer: {
        textAlign: 'center',
        marginBottom: '16px',
    },
};

export default HomePageAdmin;
