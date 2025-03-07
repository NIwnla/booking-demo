import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, List, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../service/axios';
import { routeNames } from '../../constaints/routeName';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

const JobOfferDetailAdmin = () => {
    const { id } = useParams();
    const { i18n } = useTranslation();
    const [jobOffer, setJobOffer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobOffer = async () => {
            try {
                const response = await axiosInstance.get(`job-offers/${id}`);
                setJobOffer(response.data);
            } catch (error) {
                console.error('Error fetching job offer:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobOffer();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!jobOffer) return <div>Job offer not found</div>;

    const infoItems = [
        { label: 'Employment Type', value: jobOffer.isFullTime ? 'Full Time' : 'Part Time' },
        { label: 'Working Address', value: jobOffer.workingAddress },
        { label: 'Application Time', value: jobOffer.applicationTime },
        { label: 'Department', value: jobOffer.department },
        { label: 'Salary', value: i18n.language === 'vi' ? jobOffer.salaryVN : jobOffer.salaryEN },
    ];

    const jobTitle = i18n.language === 'vi' ? jobOffer.nameVN : jobOffer.nameEN;

    return (
        <div style={{ padding: '2vh 10vw' }}>
            <Card>
                <Title level={2}>{jobTitle}</Title>
                <Paragraph style={{ marginBottom: '24px' }}>
                    {jobOffer.shortDescription}
                </Paragraph>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={16}>
                        <Card title="Job Description">
                            <div
                                dangerouslySetInnerHTML={{ __html: jobOffer.description }}
                                style={{
                                    fontSize: '1.25rem',
                                    padding: '12px'
                                }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card title="Job Details">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {infoItems.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            borderBottom: index !== infoItems.length - 1 ? '2px solid #f0f0f0' : 'none',
                                            paddingBottom: '16px'
                                        }}
                                    >
                                        <div style={{
                                            minWidth: '150px',
                                            fontWeight: 'bold',
                                            color: '#666',
                                            paddingRight: '16px',
                                            wordBreak: 'break-word'
                                        }}>
                                            {item.label}
                                        </div>
                                        <div style={{
                                            flex: 1,
                                            wordBreak: 'break-word'
                                        }}>
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </Col>
                </Row>

                <div style={{ marginTop: '24px' }}>
                    <Link to={routeNames.career.management}>
                        <Button icon={<ArrowLeftOutlined />}>
                            Back to Job Offers
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default JobOfferDetailAdmin;