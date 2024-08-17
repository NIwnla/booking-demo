import React from 'react';
import { Button, Card, Typography, Row, Col } from 'antd';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SignInPage = () => {
    const handleGoogleLogin = () => {
        // @ts-ignore
        window.location.href = import.meta.env.VITE_LOGIN_GOGGLE_URL;
    };

    const handleFacebookLogin = () => {
        // Add your Facebook login logic here
        console.log('Login with Facebook');
    };

    return (
        <Row justify="center" align="top" style={{ height: '100vh'}}>
            <Col xs={22} sm={16} md={12} lg={8}>
                <Card bordered={false} style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
                        Sign In
                    </Title>
                    <Button
                        type="primary"
                        icon={<GoogleOutlined />}
                        block
                        size="large"
                        style={{ marginBottom: '16px', backgroundColor: '#db4437', borderColor: '#db4437' }}
                        onClick={handleGoogleLogin}
                    >
                        Sign in with Google
                    </Button>
                    <Button
                        type="primary"
                        icon={<FacebookOutlined />}
                        block
                        size="large"
                        style={{ backgroundColor: '#3b5998', borderColor: '#3b5998' }}
                        onClick={handleFacebookLogin}
                    >
                        Sign in with Facebook
                    </Button>
                </Card>
            </Col>
        </Row>
    );
};

export default SignInPage;
