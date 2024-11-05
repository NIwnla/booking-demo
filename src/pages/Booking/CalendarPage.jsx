import React, { useEffect, useState } from 'react';
import { Calendar, Select, Row, Col, Tooltip, Modal, Button, Switch, Spin, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import './CalendarPage.css';
import { routeNames } from '../../constaints/routeName';
import axiosInstance from '../../service/axios';
import { apiEndPoints } from '../../constaints/apiEndPoint';

const { Title, Text } = Typography;

const CalendarPage = () => {
    const location = useLocation();
    const { branchId, branchName } = location.state || {};
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeMode, setTimeMode] = useState('night');
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
    const [isFetching, setIsFetching] = useState(false);
    const [disabledTimes, setDisabledTimes] = useState([]);
    const navigate = useNavigate();

    const customHeader = ({ value, onChange }) => {
        const monthOptions = [];
        const current = value.clone();
        const localeData = value.localeData();

        for (let i = 0; i < 12; i++) {
            const month = current.month(i);
            monthOptions.push(
                <Select.Option key={i} value={i}>
                    {localeData.monthsShort(month)}
                </Select.Option>
            );
        }

        const month = value.month();

        return (
            <div style={{ padding: 10 }}>
                <Row gutter={8}>
                    <Col>
                        <Select
                            size="small"
                            popupMatchSelectWidth={false}
                            value={month}
                            onChange={(newMonth) => {
                                const now = value.clone().month(newMonth);
                                onChange(now);
                                setSelectedMonth(newMonth);
                            }}
                        >
                            {monthOptions}
                        </Select>
                    </Col>
                </Row>
            </div>
        );
    };

    useEffect(() => {
        const getTimes = async () => {
            setIsFetching(true);
            try {
                const response = await axiosInstance.get(apiEndPoints.DISABLED_TIME.GET_BY_MONTH(2024, selectedMonth + 1, branchId));
                setDisabledTimes(response.data);
            } catch (error) {
                // Handle error
            } finally {
                setIsFetching(false);
            }
        };

        getTimes();
    }, [selectedMonth]);

    const dateFullCellRender = (current) => {
        const isPast = current.isBefore(dayjs(), 'day');
        const isToday = current.isSame(dayjs(), 'day');
        const isFuture = !isPast && !isToday;
        const isSelected = selectedDate && selectedDate.isSame(current, 'day');

        const className = `date-cell ${isPast ? 'disable' : ''} ${isFuture ? 'enable' : ''} ${isSelected ? 'selected-date' : ''}`;
        const bookedCount = disabledTimes.filter(time => dayjs(time).isSame(current, 'day')).length;
        const tooltipText = bookedCount > 0 ? `${bookedCount} booked` : '';

        const handleClick = () => {
            if (!isPast) {
                setSelectedDate(current);
                setIsModalVisible(true);
            }
        };

        return (
            <Tooltip title={tooltipText || '0 slot booked'}>
                <div className={className} onClick={handleClick}>
                    {current.date()}
                </div>
            </Tooltip>
        );
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedDate(null);
    };

    const handleAvailableClick = (time) => {
        navigate(routeNames.booking.bookingPage, { state: { selectedDate: selectedDate.format('YYYY-MM-DD'), selectedTime: time.format('HH:mm'), branchId } });
    };

    const handleUnavailableClick = () => {
        navigate(routeNames.booking.unavailable);
    };

    const renderHourRows = (date) => {
        const times = [];
        const start = timeMode === 'day' ? dayjs(date).hour(10).minute(30) : dayjs(date).hour(17).minute(0);
        const end = timeMode === 'day' ? dayjs(date).hour(16).minute(30) : dayjs(date).hour(21).minute(30);

        for (let time = start; time.isBefore(end); time = time.add(30, 'minute')) {
            times.push(time);
        }

        return times.map((time, index) => {
            const disabledTime = disabledTimes.find(bookedTime => dayjs(bookedTime.time).isSame(time, 'minute') && dayjs(bookedTime.time).isSame(time, 'date'));
            const availableCount = disabledTime ? disabledTime.available : 10;
            const isBooked = availableCount === 0;

            return (
                <div key={index} className="hour-row">
                    <Text>{time.format('HH:mm')}</Text>
                    {!isBooked ? (
                        <Button
                            type="primary"
                            style={{ backgroundColor: '#d32f2f', borderColor: '#d32f2f' , maxWidth:'30vw' }} // Red for available slots
                            onClick={() => handleAvailableClick(time)}
                        >
                            {`Available : ${availableCount}`}
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            danger
                            style={{ maxWidth:'30vw' }} // Red for unavailable slots
                            onClick={handleUnavailableClick}
                        >
                            Not Available
                        </Button>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="calendar-page">
            <Spin spinning={isFetching}>
                <div className="calendar-header">
                    <Title level={4} style={{ color: '#333' }}>Branch: {branchName}</Title>
                </div>
                <div className="calendar-container">
                    <Calendar headerRender={customHeader} fullCellRender={dateFullCellRender} />
                </div>
                <Modal
                    title={`Selected Date: ${selectedDate ? selectedDate.format('YYYY-MM-DD') : ''}`}
                    open={isModalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                >
                    <div style={{ marginBottom: '16px' }}>
                        <Switch
                            checked={timeMode === 'night'}
                            onChange={(checked) => setTimeMode(checked ? 'night' : 'day')}
                            checkedChildren="Night"
                            unCheckedChildren="Day"
                        />
                    </div>
                    {renderHourRows(selectedDate)}
                </Modal>
            </Spin>
        </div>
    );
};

export default CalendarPage;
