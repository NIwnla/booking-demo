import React, { useState } from 'react';
import { Calendar, Select, Row, Col, Tooltip, Modal, Button } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import dayjs from 'dayjs';
import './App.css'; // Import custom styles
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
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

    if (isPast) {
      return (
        <div className={className} onClick={handleClick}>
          {current.date()}
        </div>
      )
    } else {
      return (
        <Tooltip title="hello">
          <div className={className} onClick={handleClick}>
            {current.date()}
          </div>
        </Tooltip>
      );
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedDate(null);
  };

  const renderHourRows = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i); // Generate array [0, 1, 2, ..., 23]

    return hours.map((hour) => (
      <div key={hour} className="hour-row">
        <span>{`${hour}:00`}</span>
        <Button type="primary"
          disabled={hour % 2 === 0 ? false : true}
          onClick={() => navigate('/booking', { state: { selectedDate: selectedDate.format('YYYY-MM-DD') } })}>
          {hour % 2 === 0 ? 'Available' : 'Occupied'}
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
        {renderHourRows()}
      </Modal>
    </div>
  );
};

export default App;
