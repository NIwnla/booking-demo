import React, { useEffect, useState } from 'react';
import { Calendar, Select, Row, Col, Tooltip, Modal, Button, Switch, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';
import dayjs from 'dayjs';
import './CalendarPage.css'; // You might want to rename this to CalendarPage.css later
import { routeNames } from '../../constaints/routeName';
import axiosInstance from '../../service/axios';
import { apiEndPoints } from '../../constaints/apiEndPoint';

const CalendarPage = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeMode, setTimeMode] = useState('night'); // New state for time mode
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month())
    const [isFetching, setIsFetching] = useState(false)
    const [bookedTimes, setBookedTimes] = useState([]);
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
                                setSelectedMonth(newMonth)
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
            setIsFetching(true)
            try {
                const response = await axiosInstance.get(apiEndPoints.BOOKING_INFORMATION.GET_TIME_BY_MONTH(selectedMonth + 1))
                setBookedTimes(response.data)
            } catch (error) {

            } finally {
                setIsFetching(false)
            }
        }

        getTimes();
    }, [selectedMonth])

    const dateFullCellRender = (current) => {
        const isPast = current.isBefore(dayjs(), 'day');
        const isToday = current.isSame(dayjs(), 'day');
        const isCurrentMonth = current.isSame(dayjs(), 'month');
        const isFuture = !isPast && !isToday;

        const className = `date-cell ${isPast || !isCurrentMonth ? 'disable' : ''} ${isFuture && isCurrentMonth ? 'enable' : ''}`;

        // Count booked times on the current date
        const bookedCount = bookedTimes.filter(time => dayjs(time).isSame(current, 'day')).length;
        const tooltipText = bookedCount > 0 ? `${bookedCount} booked` : '';


        const handleClick = () => {
            if (!isPast || !isCurrentMonth) {
                setSelectedDate(current);
                setIsModalVisible(true);
            }
        };
        if (isPast || !isCurrentMonth) {
            return (
                <div className={className} onClick={handleClick}>
                    {current.date()}
                </div>
            )
        }

        return (
            <Tooltip title={tooltipText ? tooltipText : '0 slot booked'}>
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
        navigate(routeNames.booking.bookingPage, { state: { selectedDate: selectedDate.format('YYYY-MM-DD'), selectedTime: time.format('HH:mm') } });
    };

    const renderHourRows = () => {
        const times = [];
        const start = timeMode === 'day' ? dayjs().hour(10).minute(30) : dayjs().hour(17).minute(0);
        const end = timeMode === 'day' ? dayjs().hour(16).minute(30) : dayjs().hour(21).minute(30);

        for (let time = start; time.isBefore(end); time = time.add(30, 'minute')) {
            times.push(time);
        }

        return times.map((time, index) => {
            const isBooked = bookedTimes.some(bookedTime => dayjs(bookedTime).isSame(time, 'minute'));
            const isSameDay = dayjs(time).isSame(selectedDate, 'date')
            console.log(selectedDate);
            
            return (
                <div key={index} className="hour-row">
                    <span>{time.format('HH:mm')}</span>
                    <Button
                        type="primary"
                        disabled={isBooked}
                        onClick={!isBooked ? () => handleAvailableClick(time) : undefined}
                    >
                        {!isBooked ? 'Available' : 'Occupied'}
                    </Button>
                </div>
            )
        });
    };

    return (
        <div style={{ padding: 24 }}>
            <Spin spinning={isFetching} >
                <Calendar
                    headerRender={customHeader}
                    fullCellRender={dateFullCellRender}
                />
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
                    {renderHourRows()}
                </Modal>
            </Spin>
        </div>
    );
};

export default CalendarPage;
