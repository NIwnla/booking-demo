import { Card, Col, DatePicker, Row, Select, Spin, Statistic, Tabs } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { routeNames } from '../../constaints/routeName';
import axiosInstance from '../../service/axios';
import { getLocalizedText } from '../../helpers/getLocalizedText';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';

const BranchDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'days'), dayjs()]);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [branches, setBranches] = useState([]);
    const navigate = useNavigate();
    const isLargeScreen = useMediaQuery({ minWidth: 992 });
    const { t, i18n } = useTranslation('global');
    const [branchData, setBranchData] = useState({
        totalReservations: 0,
        statusDistribution: [],
        reservationRate: []
    });

    const COLORS = {
        Cancelled: '#FF0000',
        Booking: '#FFA500',
        Confirmed: '#008000'
    };

    const fetchBranches = async () => {
        try {
            const response = await axiosInstance.get(apiEndPoints.BRANCH.GET_ALL);
            setBranches(response.data);
            setSelectedBranchId(response.data[0].id)
        } catch (error) {
            console.error('Failed to fetch branches:', error);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);


    const fetchBranchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(apiEndPoints.DASHBOARD.BRANCH(selectedBranchId), {
                params: {
                    startDate: dateRange[0].format('YYYY-MM-DD'),
                    endDate: dateRange[1].format('YYYY-MM-DD')
                }
            });
            setBranchData(response.data);
        } catch (error) {
            console.error('Failed to fetch branch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedBranchId) {
            fetchBranchData();
        }
    }, [dateRange, selectedBranchId]);

    const handleTabChange = (key) => {
        if (key === 'overview') {
            navigate(routeNames.dashboard.overview);
        }
    };

    return (
        <>
            <Helmet>
                <title>Branch Dashboard - Nollowa Chicken</title>
            </Helmet>
            <div style={{ padding: isLargeScreen ? '24px 10vw' : '12px 2vw' }}>
                <Tabs
                    defaultActiveKey="branch"
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
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    <Select
                                        placeholder="Select Branch"
                                        style={{ width: '100%' }}
                                        value={selectedBranchId}
                                        onChange={setSelectedBranchId}
                                        options={branches.map(branch => ({
                                            value: branch.id,
                                            label: getLocalizedText(branch, 'name',i18n.language)
                                        }))}
                                    />
                                </Col>

                                <Col xs={24} md={12}>
                                    <DatePicker.RangePicker
                                        // @ts-ignore
                                        value={dateRange}
                                        onChange={setDateRange}
                                        style={{ width: '100%' }}
                                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                <Spin spinning={loading}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={8}>
                            <Card>
                                <Statistic
                                    title="Branch Total Reservations"
                                    value={branchData.totalReservations}
                                    style={{ textAlign: 'center' }}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} lg={16}>
                            <Card title="Branch Reservation Status">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={branchData.statusDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, count }) => `${name}: ${count}`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {branchData.statusDistribution.map((entry) => (
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
                            <Card title="Daily Branch Reservation Rate">
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={branchData.reservationRate}>
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

export default BranchDashboard;