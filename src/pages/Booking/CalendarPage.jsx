import React, { useEffect, useState } from 'react';
import { Calendar, Select, Row, Col, Tooltip, Modal, Button, Switch, Spin } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';
import dayjs from 'dayjs';
import './CalendarPage.css'; // You might want to rename this to CalendarPage.css later
import { routeNames } from '../../constaints/routeName';
import axiosInstance from '../../service/axios';
import { apiEndPoints } from '../../constaints/apiEndPoint';

const CalendarPage = () => {
    const location = useLocation();
    const { branchId, branchName } = location.state || {};
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeMode, setTimeMode] = useState('night'); // New state for time mode
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month())
    const [isFetching, setIsFetching] = useState(false)
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
                const response = await axiosInstance.get(apiEndPoints.DISABLED_TIME.GET_BY_MONTH(2024, selectedMonth + 1, branchId))
                setDisabledTimes(response.data)
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
        const isFuture = !isPast && !isToday;

        const className = `date-cell ${isPast ? 'disable' : ''} ${isFuture ? 'enable' : ''}`;

        // Count booked times on the current date
        const bookedCount = disabledTimes.filter(time => dayjs(time).isSame(current, 'day')).length;
        const tooltipText = bookedCount > 0 ? `${bookedCount} booked` : '';


        const handleClick = () => {
            if (!isPast) {
                setSelectedDate(current);
                setIsModalVisible(true);
            }
        };
        if (isPast) {
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
                    <span>{time.format('HH:mm')}</span>
                    {!isBooked ?
                        (<Button
                            type="primary"
                            onClick={() => handleAvailableClick(time)}
                        >
                            {`Available : ${availableCount}`}
                        </Button>)
                        :
                        (<Button
                            type="primary"
                            danger
                            onClick={() => handleUnavailableClick()}
                        >
                            Not Available
                        </Button>)}

                </div>
            );
        });
    };


    return (
        <div style={{ padding: 24 }}>
            <Spin spinning={isFetching} >
                <div>Branch choosed : {branchName}</div>
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
                    {renderHourRows(selectedDate)}
                </Modal>
            </Spin>
        </div>
    );
};

export default CalendarPage;
