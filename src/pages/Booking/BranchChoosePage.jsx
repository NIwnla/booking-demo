import { Card, Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { routeNames } from '../../constaints/routeName';
import axiosInstance from '../../service/axios';
import { getLocalizedText } from '../../helpers/getLocalizedText';
import { useTranslation } from 'react-i18next';


const BranchChoosePage = () => {
    const { i18n } = useTranslation('global');
    const [branches, setBranches] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBranches = async () => {
            setIsFetching(true);
            try {
                const response = await axiosInstance.get(apiEndPoints.BRANCH.GET_ALL, {
                    params: {
                        includeDeleted: true,
                    }
                });
                setBranches(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchBranches();
    }, []);

    const handleCardClick = (branchId, branchName) => {
        navigate(routeNames.booking.calendar, { state: { branchId, branchName } });
    };



    return (
        <div style={styles.container}>
            <Spin spinning={isFetching}>
                <Row gutter={[16, 16]}>
                    {branches.map((branch) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={branch.id}>
                            <Card
                                hoverable
                                onClick={() => handleCardClick(branch.id, branch.name)}
                                cover={
                                    <div
                                        // @ts-ignore
                                        style={styles.imageContainer} className="branch-image-container">
                                        <img
                                            // @ts-ignore
                                            style={styles.image}
                                            alt={branch.name}
                                            src={`${AxiosConstants.AXIOS_BASEURL}/${branch.imagePath}`}
                                            className="branch-image"
                                        />
                                    </div>
                                }
                                onMouseEnter={(e) => {
                                    // @ts-ignore
                                    e.currentTarget.querySelector('.branch-image').style = styles.cardHover.image;
                                    // @ts-ignore
                                    e.currentTarget.querySelector('.branch-title').style = styles.cardHover.title;
                                    // @ts-ignore
                                    e.currentTarget.querySelector('.branch-description').style = styles.cardHover.description;
                                }}
                                onMouseLeave={(e) => {
                                    // @ts-ignore
                                    e.currentTarget.querySelector('.branch-image').style = styles.image;
                                    // @ts-ignore
                                    e.currentTarget.querySelector('.branch-title').style = styles.title;
                                    // @ts-ignore
                                    e.currentTarget.querySelector('.branch-description').style = styles.description;
                                }}
                            >
                                <Card.Meta
                                    // @ts-ignore
                                    title={<div style={styles.title} className="branch-title">{getLocalizedText(branch, 'name', i18n.language)}</div>}
                                    // @ts-ignore
                                    description={<div style={styles.description} className="branch-description">{getLocalizedText(branch, 'description', i18n.language)}</div>}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Spin>
        </div>
    );
};

export default BranchChoosePage;

const styles = {
    container: { padding: '24px' },
    imageContainer: {
        width: '100%',
        height: '35vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease, filter 0.3s ease',
    },
    title: {
        position: 'absolute',
        bottom: '50%',
        left: '16px',
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '4px 8px',
        width: 'calc(100% - 32px)',
        textAlign: 'center',
        transition: 'color 0.3s ease, background-color 0.3s ease',
    },
    description: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '8px',
        boxSizing: 'border-box',
        whiteSpace: 'normal',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxHeight: '50%',
        transition: 'transform 0.3s ease, maxHeight 0.3s ease, backgroundColor 0.3s ease',
    },
    cardHover: {
        image: {
            transform: 'scale(1.1)',
            filter: 'brightness(70%)',
        },
        title: {
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        description: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            maxHeight: '100%',
            transform: 'translateY(0)',
        },
    },
};
