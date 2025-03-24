import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { routeNames } from '../../constaints/routeName';
import { Helmet } from 'react-helmet-async';

const { Title, Text } = Typography;

const NotFoundPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('global');

    const goHome = () => {
        navigate(routeNames.index);
    };

    return (
        <>
            <Helmet>
                <title>Page Not Found - Nollowa Chicken</title>
                <meta name="description" content="The page you're looking for cannot be found" />
            </Helmet>
            <div style={{ textAlign: 'center', marginTop: '10%' }}>
                <Title level={1} style={{ fontSize: '72px', color: '#1890ff' }}>
                    {t('notFoundPage.title')}
                </Title>
                <Title level={2}>{t('notFoundPage.subtitle')}</Title>
                <Text type="secondary">{t('notFoundPage.description')}</Text>
                <div style={{ marginTop: '24px' }}>
                    <Button type="primary" size="large" onClick={goHome}>
                        {t('notFoundPage.button')}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default NotFoundPage;
