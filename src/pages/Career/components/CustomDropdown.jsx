import React from 'react';
import { Dropdown, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CustomDropdown = ({ menu, value, placeholder = 'Select' }) => {
    return (
        <Dropdown menu={menu} trigger={['click']}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0'
            }}>
                <Text style={{ margin: 0, fontSize: '2rem' }}>
                    {value || placeholder}
                </Text>
                <DownOutlined style={{ fontSize: '1.5rem' }} />
            </div>
        </Dropdown>
    );
};

export default CustomDropdown;