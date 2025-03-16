import React from 'react';
import { Dropdown, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CustomDropdown = ({ menu, value, valueId, placeholder = 'Select', fontSize = '2rem' }) => {
    return (
        <Dropdown menu={menu} trigger={['click']}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                background:'white'
            }}>
                <Text style={{ margin: 0, fontSize: fontSize }}>
                    {value || placeholder}
                </Text>
                <DownOutlined style={{ fontSize: fontSize }} />
            </div>
        </Dropdown>
    );
};

export default CustomDropdown;