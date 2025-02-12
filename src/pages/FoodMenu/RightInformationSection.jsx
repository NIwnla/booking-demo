import React, { useContext } from 'react';
import { Card, Typography, Empty, Image } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { DeliveryContext } from '../../context/DeliveryContext';
import { AxiosConstants } from '../../constaints/axiosContaint';

const { Paragraph, Title } = Typography;

const RightInformationSection = () => {
    const { cart } = useContext(DeliveryContext);
    const cartIsEmpty = cart.length === 0;

    return (
        <div>
            {/* Location Card */}
            <Card style={{ textAlign: 'start', borderRadius: '10px', marginBottom: '20px' }}>
                <Paragraph>📍 <strong>Location:</strong> Your location details here</Paragraph>
            </Card>

            {/* Shopping Cart Card */}
            <Card style={{ textAlign: 'start', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <Title level={4}>Shopping Cart</Title>

                {cartIsEmpty ? (
                    <Empty
                        image={<ShoppingCartOutlined style={{ fontSize: '7rem', color: '#bfbfbf' }} />}
                        description="Your shopping cart is empty"
                    />
                ) : (
                    <div>
                        {cart.map((item) => (
                            <div key={item.cartItemKey} style={{ display: 'flex', gap: '10px', marginBottom: '15px', padding: '10px', borderBottom: '1px solid #ddd' }}>
                                {/* Item Image */}
                                <Image
                                    preview={false}
                                    src={`${AxiosConstants.AXIOS_BASEURL}/${item.imagePath}`}
                                    alt={item.name}
                                    style={{ width: '50px', height: '50px', borderRadius: '5px' }}
                                />

                                {/* Item Details */}
                                <div style={{ flex: 1 }}>
                                    <Title level={5} style={{ margin: 0 }}>{item.name}</Title>

                                    {/* Show options if available */}
                                    {item.options.length > 0 && (
                                        <ul style={{ paddingLeft: '15px', margin: '5px 0' }}>
                                            {item.options.map(option => (
                                                <li key={option.id} style={{ fontSize: '0.9rem', color: '#555' }}>
                                                    {option.nameEN} (+{option.price} VND)
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <Paragraph style={{ margin: 0 }}>Total: <strong>{item.total.toLocaleString()} VND</strong></Paragraph>
                                    <Paragraph style={{ margin: 0 }}>Quantity: <strong>{item.quantity}</strong></Paragraph>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default RightInformationSection;
