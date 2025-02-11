import React from 'react';
import { Card, Typography } from 'antd';

const { Paragraph } = Typography;

const RightInformationSection = () => {
    return (
        <div>
            <Card style={{ textAlign: 'start', borderRadius: '10px', marginBottom: '20px' }}>
                <Paragraph>Location: Your location details here</Paragraph>
            </Card>
            <Card style={{ textAlign: 'start', borderRadius: '10px' }}>
                <Paragraph>Shopping Cart: Your shopping cart details here</Paragraph>
            </Card>
        </div>
    );
};

export default RightInformationSection;