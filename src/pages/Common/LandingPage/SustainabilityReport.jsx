import { Button, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';

const { Title, Text } = Typography;

const SustainabilityReport = () => {
    const { t } = useTranslation('global');
    const isLargeScreen = useMediaQuery({ minWidth: 992 });

    return (
        <div style={{ 
            backgroundColor: 'gray', 
            position: 'relative', 
            zIndex: 1,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap:'10px',
            minHeight: '10rem',
            justifyContent: 'space-between'
        }}>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'flex-start'
            }}>
                <Title style={{ 
                    color: 'white', 
                    fontSize:  isLargeScreen ?'4rem' : '2rem', 
                    width: isLargeScreen ? '45%' : '100%',
                    margin: 0 
                }}>
                    {t('sustainabilityReport.title')}
                </Title>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
            }}>
                <Button
                    shape="circle"
                    style={{
                        height: isLargeScreen ? '6rem' : '4rem',
                        width: isLargeScreen ? '8rem' : '6rem',
                        backgroundColor: 'white',
                        color: 'red',
                        transition: 'background-color 0.3s ease, color 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'red';
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = 'red';
                    }}
                >
                    <p style={{ fontSize: isLargeScreen ? '1.5rem' : '1rem', margin: 0 }}>
                        {t('sustainabilityReport.button.view')} <br />
                        {t('sustainabilityReport.button.report')}
                    </p>
                </Button>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <p style={{ 
                    color: 'white', 
                    fontSize: isLargeScreen ? '1.8rem': '1rem', 
                    width: isLargeScreen ? '45%' : '100%',
                    margin: 0 
                }}>
                    {t('sustainabilityReport.description')}
                </p>
            </div>
        </div>
    );
};

export default SustainabilityReport;
