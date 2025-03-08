import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../../service/axios';
import { apiEndPoints } from '../../../constaints/apiEndPoint';
import CareerNavBar from '../components/CareerNavBar';
import CustomDropdown from '../components/CustomDropdown';

const { Title } = Typography;

const FindJobsPage = () => {
    const location = useLocation();
    const [searchValue, setSearchValue] = useState(location.state?.search || '');
    const [selectedWhat, setSelectedWhat] = useState(location.state?.type || null);
    const [selectedWhere, setSelectedWhere] = useState(location.state?.location || null);
    const [jobTypes, setJobTypes] = useState([]);

    useEffect(() => {
        const fetchJobTypes = async () => {
            try {
                const response = await axiosInstance.get(apiEndPoints.JOB_TYPE.GET_ALL);
                setJobTypes(response.data);
            } catch (error) {
                console.error('Error fetching job types:', error);
            }
        };

        fetchJobTypes();
    }, []);

    const whatItems = {
        items: jobTypes.map(type => ({
            key: type.id,
            label: type.name,
            onClick: () => setSelectedWhat(type.name),
        })),
    };

    const whereItems = {
        items: [
            {
                key: '1',
                label: 'Ha Noi',
                onClick: () => setSelectedWhere('Ha Noi'),
            },
            {
                key: '2',
                label: 'Ho Chi Minh',
                onClick: () => setSelectedWhere('Ho Chi Minh'),
            },
            {
                key: '3',
                label: 'Da Nang',
                onClick: () => setSelectedWhere('Da Nang'),
            },
        ],
    };

    return (
        <div style={{minHeight: '100vh'}}>
            <CareerNavBar selected="find-jobs" />
            
            <div style={{ padding: '225px 10vw' }}>
                <Title level={1} style={{ marginBottom: '40px' }}>Find Jobs</Title>
                
                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col span={8}>
                        <Input
                            placeholder="Search jobs..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{
                                fontSize: '1rem',
                                height: '40px'
                            }}
                        />
                    </Col>
                    <Col span={8}>
                        <div style={{ border: '1px solid #d9d9d9', borderRadius: '2px' }}>
                            <CustomDropdown 
                                menu={whatItems}
                                value={selectedWhat}
                                placeholder="What"
                            />
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ border: '1px solid #d9d9d9', borderRadius: '2px' }}>
                            <CustomDropdown 
                                menu={whereItems}
                                value={selectedWhere}
                                placeholder="Where"
                            />
                        </div>
                    </Col>
                </Row>

                {/* Job listings will be added here */}
            </div>
        </div>
    );
};

export default FindJobsPage;