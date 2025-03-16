import React from 'react';
import { Input, Row, Col, Button } from 'antd';
import CustomDropdown from './CustomDropdown';

const JobSearchBar = ({ 
    searchValue, 
    onSearchChange, 
    whatItems, 
    whereItems, 
    selectedWhat, 
    selectedWhatId, 
    selectedWhere, 
    onSearch, 
    isSearching, 
    isLargeScreen 
}) => {
    return (
        <Row style={{ marginBottom: '24px' }}>
            <Col xs={8} lg={6}>
                <Input
                    placeholder="Search jobs..."
                    value={searchValue}
                    onChange={onSearchChange}
                    style={{
                        fontSize: isLargeScreen ? '2rem' : '1rem',
                        borderRadius: '24px 0 0 24px',
                        border: '2px solid rgb(0, 0, 0)',
                        height: '100%',
                    }}
                />
            </Col>
            <Col xs={8} lg={6}>
                <div style={{
                    border: '2px solid rgb(0, 0, 0)',
                    borderLeft: 'none',
                    padding: '0 1rem',
                    height: '100%',
                    backgroundColor:'white'
                }}>
                    <CustomDropdown
                        menu={whatItems}
                        value={selectedWhat}
                        valueId={selectedWhatId}
                        placeholder="What"
                        fontSize={isLargeScreen ? '2rem' : '1rem'}
                    />
                </div>
            </Col>
            <Col xs={8} lg={6}>
                <div style={{
                    border: '2px solid rgb(0, 0, 0)',
                    borderLeft: 'none',
                    borderRadius: isLargeScreen ? '0' : '0 24px 24px 0',
                    padding: '0 1rem',
                    height: '100%',
                    backgroundColor: 'white'
                }}>
                    <CustomDropdown
                        menu={whereItems}
                        value={selectedWhere}
                        valueId={selectedWhatId}
                        placeholder="Where"
                        fontSize={isLargeScreen ? '2rem' : '1rem'}
                    />
                </div>
            </Col>
            <Col xs={24} lg={6}>
                <div style={{
                    width: "100%",
                    height: '100%',
                    marginTop: isLargeScreen ? '0' : '1rem'
                }}>
                    <Button
                        type="primary"
                        loading={isSearching}
                        style={{
                            width: '100%',
                            borderRadius: isLargeScreen ? '0 24px 24px 0' : '24px',
                            fontSize: isLargeScreen ? '2rem' : '1rem',
                            border: 'none',
                            background: '#1a365d',
                            height: '100%'
                        }}
                        onClick={onSearch}
                    >
                        {isSearching ? 'Searching...' : 'Search Jobs'}
                    </Button>
                </div>
            </Col>
        </Row>
    );
};

export default JobSearchBar;