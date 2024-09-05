import React from 'react';
import { Alert, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { routeNames } from '../../constaints/routeName';

const UnavailableTimeAlert = () => {
    const navigate = useNavigate();
    const handleButtonClick = () => {
        navigate(routeNames.booking.branchChoose)
    }
    return (
        <Alert
            message="Time Unavailable"
            description={
                <>
                    <p>Unfortunately, the time slot you selected is currently unavailable for booking. This might be due to high demand or scheduling conflicts.</p>
                    <p>We apologize for the inconvenience and encourage you to try selecting a different time for your booking.</p>
                    <Button type="primary" onClick={handleButtonClick} style={{ marginTop: '16px' }}>
                        Back to booking page
                    </Button>
                </>
            }
            type="warning"
            showIcon
            icon={<ExclamationCircleOutlined />}
            style={{ fontSize: '16px', padding: '20px', borderRadius: '8px' }}
        />
    );
};

export default UnavailableTimeAlert;
