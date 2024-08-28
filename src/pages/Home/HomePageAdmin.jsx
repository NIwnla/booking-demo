import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';
import axiosInstance from '../../service/axios';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import dayjs from 'dayjs';

const HomePageAdmin = () => {
    const [bookingFrequencyData, setBookingFrequencyData] = useState([]);
    const [bookingStatusData, setBookingStatusData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const startDate = dayjs().subtract(1, 'week').format('YYYY-MM-DD');
            try {
                const response = await axiosInstance.get(apiEndPoints.DASHBOARD.ADMIN, {
                    params: {
                        startDate: startDate,
                    },
                });
                setBookingFrequencyData(response.data.bookingFrequency);
                setBookingStatusData(response.data.bookingStatusCounts);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    const COLORS = {
        Cancelled: '#FF0000', // Red
        Booking: '#FFA500', // Orange
        Confirmed: '#008000' // Green
    };

    return (
        <div style={{ padding: '24px' }}>
            <h2>Admin Dashboard</h2>
            <div style={{ marginBottom: '40px' }}>
                <h3>Booking Frequency</h3>
                <ResponsiveContainer width="50%" height={400}>
                    <LineChart
                        data={bookingFrequencyData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" >
                            <LabelList dataKey="count" position="top" />
                        </Line>
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div>
                <h3>Booking Status Ratio</h3>
                <ResponsiveContainer width="50%" height={400}>
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
            </div>
        </div>
    );
};

export default HomePageAdmin;
