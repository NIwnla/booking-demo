import React from 'react';
import { Typography, Button } from 'antd';

const { Title } = Typography;

const Contact = () => {
    return (
        <div style={{ padding: '4rem 7vw', backgroundColor: 'white', position: 'relative', zIndex: 1 }}>
            <div style={{
                borderTop: '1px solid #ddd',
                borderBottom: '1px solid #ddd',
                padding: '3rem 0',
                textAlign: 'center'
            }}>
                <Title level={2} style={{ marginBottom: '2rem' }}>
                    For Career
                </Title>
                <div style={{
                    fontSize: '1.2rem',
                    color: '#666',
                    marginBottom: '2rem'
                }}>
                    email@nollowaChicken.com
                </div>
                <Button
                    type="primary"
                    shape="round"
                    size="large"
                    style={{
                        backgroundColor: 'red',
                        borderColor: 'red',
                        minWidth: '150px',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = 'red';
                        e.currentTarget.style.borderColor = 'red';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'red';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = 'red';
                    }}
                >
                    Contact Us
                </Button>
            </div>
        </div>
    );
};

export default Contact;