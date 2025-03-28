import React, { useEffect, useState } from 'react';
import { Button, Calendar, Col, Modal, Row, Select, Space, Spin, Switch, Tag } from 'antd';
import 'antd/dist/reset.css';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import axiosInstance from '../../service/axios';
import './DisableCalendarPage.css';

const DisableCalendarPage = () => {
    const { t } = useTranslation("global");
    const location = useLocation();
    const { branchId, branchName } = location.state || {};
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeMode, setTimeMode] = useState('night');
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
    const [isFetching, setIsFetching] = useState(false);
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

    const getTimes = async () => {
        setIsFetching(true);
        const currentYear = dayjs().year();
        try {
            const response = await axiosInstance.get(apiEndPoints.DISABLED_TIME.GET_BY_MONTH(currentYear, selectedMonth + 1, branchId));
            setDisabledTimes(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        getTimes();
    }, [selectedMonth]);

    const dateFullCellRender = (current) => {
        const isPast = current.isBefore(dayjs(), 'day');
        const isToday = current.isSame(dayjs(), 'day');
        const isCurrentMonth = current.isSame(dayjs(), 'month');
        const isFuture = !isPast && !isToday;

        const className = `date-cell ${isPast || !isCurrentMonth ? 'disable' : ''} ${isFuture && isCurrentMonth ? 'enable' : ''}`;

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
        setIsDisabling(true);
        try {
            const payload = {
                time: time.format('YYYY-MM-DDTHH:mm'),
                branchId,
                available: 0
            };
            await axiosInstance.post(apiEndPoints.DISABLED_TIME.CREATE, payload);
            getTimes();
        } catch (error) {
            console.error(error);
        } finally {
            setIsDisabling(false);
        }
    };

    const handleEnableTime = async (time) => {
        setIsDisabling(true);
        try {
            await axiosInstance.delete(apiEndPoints.DISABLED_TIME.DELETE(time.format('YYYY-MM-DDTHH:mm')));
            getTimes();
        } catch (error) {
            console.error(error);
        } finally {
            setIsDisabling(false);
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
            const disabledTime = disabledTimes.find(bookedTime => dayjs(bookedTime.time).isSame(time, 'minute') && dayjs(bookedTime.time).isSame(time, 'date'));
            const availableCount = disabledTime ? disabledTime.available : 10;

            return (
                <div key={index} className="hour-row">
                    <span>{time.format('HH:mm')}</span>
                    <Tag color={availableCount === 0 ? 'red' : 'green'}>
                        {availableCount === 0
                            ? t('booking.disableCalendarPage.tags.inactive')
                            : `${t('booking.disableCalendarPage.tags.available')} ${availableCount}`}
                    </Tag>
                    <Space wrap>
                        <Button
                            type="primary"
                            disabled={availableCount === 0}
                            onClick={() => handleDisableTime(time)}
                            loading={isFetching}
                        >
                            {t('booking.disableCalendarPage.buttons.disable')}
                        </Button>
                        <Button
                            type="primary"
                            disabled={availableCount > 0}
                            onClick={() => handleEnableTime(time)}
                            loading={isFetching}
                        >
                            {t('booking.disableCalendarPage.buttons.enable')}
                        </Button>
                    </Space>
                </div>
            );
        });
    };

    return (
        <div style={{ padding: 24 }}>
            <div>{`${t('booking.disableCalendarPage.branchSelected')} ${branchName}`}</div>
            <Spin spinning={isFetching}>
                <Calendar
                    headerRender={customHeader}
                    fullCellRender={dateFullCellRender}
                />
                <Modal
                    title={`${t('booking.disableCalendarPage.modalTitle')} ${selectedDate?.format('YYYY-MM-DD') }`}
                    open={isModalVisible}
                    onCancel={handleModalClose}
                    footer={null}
                >
                    <div style={{ marginBottom: '16px' }}>
                        <Switch
                            checked={timeMode === 'night'}
                            onChange={(checked) => setTimeMode(checked ? 'night' : 'day')}
                            checkedChildren={t('booking.disableCalendarPage.timeMode.night')}
                            unCheckedChildren={t('booking.disableCalendarPage.timeMode.day')}
                        />
                    </div>
                    {renderHourRows(selectedDate)}
                </Modal>
            </Spin>
        </div>
    );
};

export default DisableCalendarPage;
