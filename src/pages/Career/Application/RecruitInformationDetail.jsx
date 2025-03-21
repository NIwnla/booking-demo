import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Space, Spin, message, Popconfirm } from 'antd';
import { FilePdfOutlined, CheckOutlined, CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../service/axios';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import { AxiosConstants } from '../../../constaints/axiosContaint';
import { routeNames } from '../../../constaints/routeName';
import { useMediaQuery } from 'react-responsive';

const RecruitInformationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('global');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const isLargeScreen = useMediaQuery({ minWidth: 992 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(apiEndPoints.RECRUIT_INFORMATION.GET_BY_ID(id));
                setData(response.data);
            } catch (error) {
                message.error(t('career.detail.messages.fetchError'));
                console.error('Error fetching recruit information:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleConfirm = async () => {
        try {
            await axiosInstance.put(`${apiEndPoints.RECRUIT_INFORMATION.CONFIRM}/${id}`);
            message.success(t('career.detail.messages.confirmSuccess'));
            navigate(routeNames.recruitInformation.list);
        } catch (error) {
            message.error(t('career.detail.messages.confirmError'));
        }
    };

    const handleDeny = async () => {
        try {
            await axiosInstance.put(`${apiEndPoints.RECRUIT_INFORMATION.DENY}/${id}`);
            message.success(t('career.detail.messages.denySuccess'));
            navigate(routeNames.recruitInformation.list);
        } catch (error) {
            message.error(t('career.detail.messages.denyError'));
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: isLargeScreen ? '5vh 10vw' : '5vh 2vw' }}>
            <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate(routeNames.recruitInformation.management)}
                style={{ marginBottom: '16px' }}
            >
                {t('career.detail.backButton')}
            </Button>

            <Card title={t('career.detail.title')} style={{ marginBottom: '24px' }}>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label={t('career.detail.fields.fullName')}>
                        {`${data.firstName} ${data.lastName}`}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('career.detail.fields.email')}>
                        {data.email}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('career.detail.fields.phoneNumber')}>
                        {data.phoneNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('career.detail.fields.socialNumber')}>
                        {data.socialNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('career.detail.fields.currentEducation')}>
                        {data.currentEducation}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('career.detail.fields.desiredJob')}>
                        {i18n.language === 'vi' ? data.desiredJobVN : data.desiredJobEN}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('career.detail.fields.resume')}>
                        <Button 
                            type="primary" 
                            icon={<FilePdfOutlined />}
                            onClick={() => window.open(`${AxiosConstants.AXIOS_BASEURL}/${data.resumePath}`, '_blank')}
                        >
                            {t('career.detail.viewResume')}
                        </Button>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Space>
                <Popconfirm
                    title={t("career.management.messages.confirmApplication")}
                    description={t("career.management.messages.confirmApplicationDesc")}
                    onConfirm={handleConfirm}
                    okText={t("career.management.messages.yes")}
                    cancelText={t("career.management.messages.no")}
                >
                    <Button type="primary" icon={<CheckOutlined />}>
                        {t('career.detail.confirmButton')}
                    </Button>
                </Popconfirm>
                <Popconfirm
                    title={t("career.management.messages.denyApplication")}
                    description={t("career.management.messages.denyApplicationDesc")}
                    onConfirm={handleDeny}
                    okText={t("career.management.messages.yes")}
                    cancelText={t("career.management.messages.no")}
                >
                    <Button danger icon={<CloseOutlined />}>
                        {t('career.detail.denyButton')}
                    </Button>
                </Popconfirm>
            </Space>
        </div>
    );
};

export default RecruitInformationDetail;