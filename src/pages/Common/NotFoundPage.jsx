import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { routeNames } from '../../constaints/routeName';

const { Title, Text } = Typography;

const NotFoundPage = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate(routeNames.index); // Redirect to the home page
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '10%' }}>
            <Title level={1} style={{ fontSize: '72px', color: '#1890ff' }}>
                404
            </Title>
            <Title level={2}>Oops! The page you're looking for doesn't exist.</Title>
            <Text type="secondary">It looks like you may have taken a wrong turn. Don't worry, it happens to the best of us.</Text>
            <div style={{ marginTop: '24px' }}>
                <Button type="primary" size="large" onClick={goHome}>
                    Back to Home
                </Button>
            </div>
        </div>
    );
};

export default NotFoundPage;
