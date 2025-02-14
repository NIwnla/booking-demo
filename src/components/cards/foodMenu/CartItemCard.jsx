import React, { useContext } from 'react';
import { Typography, Image, Button, Row, Col } from 'antd';
import { MinusOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AxiosConstants } from '../../../constaints/axiosContaint';
import { DeliveryContext } from '../../../context/DeliveryContext';
import { getLocalizedText } from '../../../helpers/getLocalizedText';

const { Paragraph, Title } = Typography;

const CartItemCard = ({ item }) => {
    const { i18n } = useTranslation('global');
    const { addToCart, decreaseQuantity, removeFromCart } = useContext(DeliveryContext);

    return (
        <div
            style={{
                borderRadius: '10px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                backgroundColor: 'white',
                padding: '0.7vw',
                position: 'relative'
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
                    top: '0.8vh',
                    right: '0.4vw',
                    color: 'red',
                    cursor: 'pointer',
                    zIndex: 10,
                }}
            />

            {/* Item Layout */}
            <Row align="top">
                {/* Image Column */}
                <Col span={6}>
                    <Image
                        preview={false}
                        src={`${AxiosConstants.AXIOS_BASEURL}/${item.imagePath}`}
                        alt={item.name}
                        style={{ width: '3vw', height: '3vw', borderRadius: '5px' }}
                    />
                </Col>

                {/* Details Column */}
                <Col span={18}>
                    <Title
                        level={5}
                        style={{
                            margin: 0,
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            overflow: "hidden",
                            maxWidth: "100%",
                            marginRight: "1vw",
                        }}
                    >
                        {getLocalizedText(item, "name", i18n.language)}
                    </Title>

                    {/* Show options if available */}
                    {item.options.length > 0 && (
                        <ul style={{ paddingLeft: '15px', margin: '5px 0' }}>
                            {item.options.map(option => (
                                <li
                                    key={option.id}
                                    style={{
                                        fontSize: "0.8vw",
                                        color: "#555",
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                        maxWidth: "100%",
                                    }}
                                >
                                    {getLocalizedText(option, "name", i18n.language)} (+{option.price} VND)
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Quantity Controls & Total Price in the Same Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                        {/* Quantity Controls (Left) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5vw' }}>
                            <Button
                                style={{
                                    fontSize: '0.7vw',
                                    color: 'red'
                                }}
                                shape="circle"
                                icon={<MinusOutlined />}
                                size="small"
                                onClick={() => decreaseQuantity(item.cartItemKey)}
                                disabled={item.quantity <= 1}
                            />
                            <strong style={{ fontSize: '0.8vw' }}>{item.quantity}</strong>
                            <Button
                                style={{ fontSize: '0.7vw' }}
                                shape="circle"
                                icon={<PlusOutlined />}
                                size="small"
                                onClick={() => addToCart(item)}
                            />
                        </div>

                        {/* Total Price (Right) */}
                        <Paragraph style={{ margin: 0, fontSize: '0.8vw', fontWeight: 'bold' }}>
                            {item.total.toLocaleString()} VND
                        </Paragraph>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default CartItemCard;
