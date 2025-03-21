import React, { useContext } from 'react';
import { Typography, Image, Button, Row, Col } from 'antd';
import { MinusOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AxiosConstants } from '../../../constaints/axiosContaint';
import { DeliveryContext } from '../../../context/DeliveryContext';
import { getLocalizedText } from '../../../helpers/getLocalizedText';

const { Paragraph, Title } = Typography;

const CartItemCard = ({ item, isLargeScreen = true }) => {
    const { i18n } = useTranslation('global');
    const { addToCart, decreaseQuantity, removeFromCart } = useContext(DeliveryContext);

    return (
        <div
            style={{
                borderRadius: '10px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                backgroundColor: 'white',
                padding: isLargeScreen ? '0.75rem' : '1rem',
                position: 'relative',
                marginBottom: isLargeScreen ? '0.5rem' : '1rem',
            }}
        >
            {/* Remove Item Button */}
            <Button
                shape="circle"
                icon={<CloseOutlined />}
                onClick={(e) => {
                    e.stopPropagation();
                    removeFromCart(item.cartItemKey);
                }}
                style={{
                    position: 'absolute',
                    top: isLargeScreen ? '0.8vh' : '0.5rem',
                    right: isLargeScreen ? '0.5rem' : '0.5rem',
                    color: 'red',
                    cursor: 'pointer',
                    zIndex: 10,
                    fontSize: isLargeScreen ? '14px' : '16px'
                }}
            />

            {/* Item Layout */}
            <Row align="top" gutter={[16, 16]}>
                {/* Image Column */}
                <Col xs={8} lg={4}>
                    <Image
                        preview={false}
                        src={`${AxiosConstants.AXIOS_BASEURL}/${item.imagePath}`}
                        alt={item.name}
                        style={{ 
                            width: isLargeScreen ? '3rem' : '5rem', 
                            height: isLargeScreen ? '3rem' : '5rem', 
                            borderRadius: '8px',
                            objectFit: 'cover'
                        }}
                    />
                </Col>

                {/* Details Column */}
                <Col xs={16} lg={20}>
                    <Title
                        level={5}
                        style={{
                            width:'80%',
                            margin: 0,
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            overflow: "hidden",
                            maxWidth: "100%",
                            marginRight: "1rem",
                            fontSize: isLargeScreen ? '1rem' : '0.9rem'
                        }}
                    >
                        {getLocalizedText(item, "name", i18n.language)}
                    </Title>

                    {/* Show options if available */}
                    {item.options.length > 0 && (
                        <ul style={{ 
                            paddingLeft: isLargeScreen ? '15px' : '20px', 
                            margin: isLargeScreen ? '5px 0' : '8px 0' 
                        }}>
                            {item.options.map(option => (
                                <li
                                    key={option.id}
                                    style={{
                                        fontSize: isLargeScreen ? "0.875rem" : "0.75rem",
                                        color: "#555",
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                        maxWidth: "100%",
                                        marginBottom: isLargeScreen ? '2px' : '4px'
                                    }}
                                >
                                    {getLocalizedText(option, "name", i18n.language)} (+{option.price.toLocaleString()} VND)
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Quantity Controls & Total Price in the Same Row */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: isLargeScreen ? 'center' : 'flex-start', 
                        flexDirection : isLargeScreen ? 'row' : 'column',
                        marginTop: isLargeScreen ? '5px' : '10px'
                    }}>
                        {/* Quantity Controls (Left) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: isLargeScreen ? '0.5rem' : '0.8rem' }}>
                            <Button
                                style={{
                                    color: 'red',
                                }}
                                shape="circle"
                                size={isLargeScreen ? 'middle' : 'small'}
                                icon={<MinusOutlined />}
                                onClick={() => decreaseQuantity(item.cartItemKey)}
                                disabled={item.quantity <= 1}
                            />
                            <strong style={{ fontSize: '0.875rem' }}>{item.quantity}</strong>
                            <Button
                                shape="circle"
                                size={isLargeScreen ? 'middle' :'small'}
                                icon={<PlusOutlined />}
                                onClick={() => addToCart(item)}
                            />
                        </div>

                        {/* Total Price (Right) */}
                        <Paragraph style={{ 
                            margin: 0, 
                            fontSize: isLargeScreen ? '0.875rem' : '1.1rem', 
                            fontWeight: 'bold' 
                        }}>
                            {item.total.toLocaleString()} VND
                        </Paragraph>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default CartItemCard;
