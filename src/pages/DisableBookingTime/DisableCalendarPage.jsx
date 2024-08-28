import React, { useEffect, useState } from 'react';
import { Calendar, Select, Row, Col, Tooltip, Modal, Button, Switch, Spin, Tag } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';
import dayjs from 'dayjs';
import './DisableCalendarPage.css'; // You might want to rename this to CalendarPage.css later
import { routeNames } from '../../constaints/routeName';
import axiosInstance from '../../service/axios';
import { apiEndPoints } from '../../constaints/apiEndPoint';

const DisableCalendarPage = () => {
    const location = useLocation();
    const { branchId, branchName } = location.state || {};
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeMode, setTimeMode] = useState('night'); // New state for time mode
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month())
    const [isFetching, setIsFetching] = useState(false)
    const [disabledTimes, setDisabledTimes] = useState([]);
    const [isDisabling, setIsDisabling] = useState(false);

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
    useEffect(() => {
        getTimes();
    }, [selectedMonth])

    const dateFullCellRender = (current) => {
        const isPast = current.isBefore(dayjs(), 'day');
        const isToday = current.isSame(dayjs(), 'day');
        const isCurrentMonth = current.isSame(dayjs(), 'month');
        const isFuture = !isPast && !isToday;

        const className = `date-cell ${isPast || !isCurrentMonth ? 'disable' : ''} ${isFuture && isCurrentMonth ? 'enable' : ''}`;

        // Count booked times on the current date
        const bookedCount = disabledTimes.filter(time => dayjs(time).isSame(current, 'day')).length;


        const handleClick = () => {
            if (!isPast || !isCurrentMonth) {
                setSelectedDate(current);
                setIsModalVisible(true);
            }
        };


        return (
            <div className={className} onClick={handleClick}>
                {current.date()}
            </div>
        );


    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedDate(null);
    };

    const handleDisableTime = async (time) => {
        setIsDisabling(true)
        try {
            const payload = {
                time: time.format('YYYY-MM-DDTHH:mm'),
                branchId
            }
            const response = await axiosInstance.post(apiEndPoints.DISABLED_TIME.CREATE, payload)
            getTimes();
        } catch (error) {

        } finally {
            setIsDisabling(false)
        }
    };

    const handleEnableTime = async (time) => {
        setIsDisabling(true)
        try {
            const response = await axiosInstance.delete(apiEndPoints.DISABLED_TIME.DELETE(time.format('YYYY-MM-DDTHH:mm')))
            getTimes();
        } catch (error) {

        } finally {
            setIsDisabling(false)
        }
    };

    const renderHourRows = (date) => {
        const times = [];
        const start = timeMode === 'day' ? dayjs(date).hour(10).minute(30) : dayjs(date).hour(17).minute(0);
        const end = timeMode === 'day' ? dayjs(date).hour(16).minute(30) : dayjs(date).hour(21).minute(30);

        for (let time = start; time.isBefore(end); time = time.add(30, 'minute')) {
            times.push(time);
        }

        return times.map((time, index) => {
            const isDisabledTime = disabledTimes.some(bookedTime => dayjs(bookedTime).isSame(time, 'minute') && dayjs(bookedTime).isSame(time, 'date'));

            return (
                <div key={index} className="hour-row">
                    <span>{time.format('YYYY-MM-DD HH:mm')}</span>
                    <Tag color={isDisabledTime ? 'red' : 'green'}> {isDisabledTime ? 'Inactive' : 'Active'}</Tag>
                    <div>
                        <Button
                            type="primary"
                            disabled={isDisabledTime}
                            onClick={() => handleDisableTime(time)}
                        >
                            Disable
                        </Button>
                        <Button
                            style={{ marginLeft: '1vw' }}
                            type="primary"
                            disabled={!isDisabledTime}
                            onClick={() => handleEnableTime(time)}
                        >
                            Enable
                        </Button>
                    </div>
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
                    {renderHourRows(selectedDate)}
                </Modal>
            </Spin>
        </div>
    );
};

export default DisableCalendarPage;
