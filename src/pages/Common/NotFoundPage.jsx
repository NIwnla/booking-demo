import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { routeNames } from '../../constaints/routeName';

const { Title, Text } = Typography;

const NotFoundPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('global');

    const goHome = () => {
        navigate(routeNames.index);
    };

    return (
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
    );
};

export default NotFoundPage;
