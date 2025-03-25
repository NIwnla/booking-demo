import React, { useEffect, useState } from 'react';
import { Card, Col, DatePicker, Row, Spin, Statistic, Tabs } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axiosInstance from '../../service/axios';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import dayjs from 'dayjs';
import { Helmet } from 'react-helmet-async';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { routeNames } from '../../constaints/routeName';

const DashboardOverview = () => {
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'days'), dayjs()]);
    const isLargeScreen = useMediaQuery({ minWidth: 992 });
    const navigate = useNavigate();
    const [overviewData, setOverviewData] = useState({
        totalReservations: 0,
        statusDistribution: [],
        reservationRate: []
    });

    const COLORS = {
        Cancelled: '#FF0000',
        Booking: '#FFA500',
        Confirmed: '#008000'
    };

    const fetchOverviewData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.DASHBOARD.OVERVIEW, {
                params: {
                    startDate: dateRange[0].format('YYYY-MM-DD'),
                    endDate: dateRange[1].format('YYYY-MM-DD')
                }
            });
            setOverviewData(response.data);
        } catch (error) {
            console.error('Failed to fetch overview data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverviewData();
    }, [dateRange]);

    const handleTabChange = (key) => {
        if (key === 'branch') {
            navigate(routeNames.dashboard.branch);
        }
    };

    return (
        <>
            <Helmet>
                <title>Reservation Overview - Nollowa Chicken Admin</title>
            </Helmet>
            <div style={{ padding: isLargeScreen ? '24px 10vw' : '12px 2vw' }}>
                <Tabs
                    defaultActiveKey="overview"
                    onChange={handleTabChange}
                    items={[
                        {
                            key: 'overview',
                            label: 'Overview Dashboard',
                        },
                        {
                            key: 'branch',
                            label: 'Branch Dashboard',
                        },
                    ]}
                />
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col span={24}>
                        <Card>
                            <DatePicker.RangePicker
                                // @ts-ignore
                                value={dateRange}
                                onChange={setDateRange}
                                style={{ width: '100%' }}
                                disabledDate={(current) => current && current > dayjs().endOf('day')}
                            />
                        </Card>
                    </Col>
                </Row>

                <Spin spinning={loading}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={8}>
                            <Card>
                                <Statistic
                                    title="Total Reservations"
                                    value={overviewData.totalReservations}
                                    style={{ textAlign: 'center' }}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} lg={16}>
                            <Card title="Reservation Status Distribution">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={overviewData.statusDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, count }) => `${name}: ${count}`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {overviewData.statusDistribution.map((entry) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={COLORS[entry.name] || '#8884d8'}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>

                        <Col span={24}>
                            <Card title="Daily Reservation Rate">
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={overviewData.reservationRate}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="count"
                                            fill="#8884d8"
                                            name="Reservations"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                    </Row>
                </Spin>
            </div>
        </>
    );
};

export default DashboardOverview;