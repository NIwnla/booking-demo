import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../service/axios';
import { apiEndPoints } from '../../constaints/apiEndPoint';
import './DisableBranchChoosePage.css';
import { AxiosConstants } from '../../constaints/axiosContaint';
import { routeNames } from '../../constaints/routeName';

const DisableBranchChoosePage = () => {
    const [branches, setBranches] = useState([]);
    const [isFetching, setIsFetching] = useState(false); // Add a isFetching state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBranches = async () => {
            setIsFetching(true)
            try {
                const response = await axiosInstance.get(apiEndPoints.BRANCH.GET_ALL(true));
                setBranches(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
            } finally {
                setIsFetching(false); // Set isFetching to false after the fetch is complete
            }
        };

        fetchBranches();
    }, []);

    const handleCardClick = (branchId, branchName) => {
        navigate(routeNames.disableTime.calendar, { state: { branchId, branchName } });
    };

    return (
        <div style={{ padding: '24px' }}>
            <Spin spinning={isFetching}>
                <Row gutter={[16, 16]}>
                    {branches.map((branch) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={branch.id}>
                            <Card
                                hoverable
                                onClick={() => handleCardClick(branch.id, branch.name)}
                                cover={
                                    <div className="branch-image-container">
                                        <img className="branch-image" alt={branch.name} src={`${AxiosConstants.AXIOS_BASEURL}/${branch.imagePath}`} />
                                    </div>
                                }
                            >
                                <Card.Meta
                                    title={<div className="branch-title">{branch.name}</div>}
                                    description={<div className="branch-description">{branch.description}</div>}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Spin>
        </div>
    );
};

export default DisableBranchChoosePage;
