import React, { useState } from 'react';
import { Calendar, Select, Row, Col, Tooltip, Modal, Button, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';
import dayjs from 'dayjs';
import './CalendarPage.css'; // You might want to rename this to CalendarPage.css later

const CalendarPage = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeMode, setTimeMode] = useState('afternoon'); // New state for time mode
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
                            }}
                        >
                            {monthOptions}
                        </Select>
                    </Col>
                </Row>
            </div>
        );
    };

    const dateFullCellRender = (current) => {
        const isPast = current.isBefore(dayjs(), 'day');
        const isToday = current.isSame(dayjs(), 'day');
        const isFuture = !isPast && !isToday;

        const className = `date-cell ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}`;

        const handleClick = () => {
            if (!isPast) {
                setSelectedDate(current);
                setIsModalVisible(true);
            }
        };

        return (
            <Tooltip title="hello">
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

    const handleAvailableClick = () => {
        navigate('/booking', { state: { selectedDate: selectedDate.format('YYYY-MM-DD') } });
    };

    const renderHourRows = () => {
        const times = [];
        const start = timeMode === 'morning' ? dayjs().hour(10).minute(30) : dayjs().hour(17).minute(0);
        const end = timeMode === 'morning' ? dayjs().hour(16).minute(30) : dayjs().hour(21).minute(30);

        for (let time = start; time.isBefore(end); time = time.add(30, 'minute')) {
            times.push(time);
        }

        return times.map((time, index) => (
            <div key={index} className="hour-row">
                <span>{time.format('HH:mm')}</span>
                <Button
                    type="primary"
                    disabled={index % 2 === 0 ? false : true}
                    onClick={index % 2 === 0 ? handleAvailableClick : undefined}
                >
                    {index % 2 === 0 ? 'Available' : 'Occupied'}
                </Button>
            </div>
        ));
    };

    return (
        <div style={{ padding: 24 }}>
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
                        checked={timeMode === 'afternoon'}
                        onChange={(checked) => setTimeMode(checked ? 'afternoon' : 'morning')}
                        checkedChildren="Afternoon"
                        unCheckedChildren="Morning"
                    />
                </div>
                {renderHourRows()}
            </Modal>
        </div>
    );
};

export default CalendarPage;
