import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Image, Typography } from 'antd';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AxiosConstants } from '../../../constaints/axiosContaint';
import { routeNames } from '../../../constaints/routeName';
import { DeliveryContext } from '../../../context/DeliveryContext';
import { getLocalizedText } from '../../../helpers/getLocalizedText';

const { Title, Paragraph } = Typography;

const FoodCard = ({ food, onClick = null }) => {
    const { i18n } = useTranslation('global');
    const { addToCart } = useContext(DeliveryContext);
    const navigate = useNavigate();

    return (
        <Card
            hoverable
            onClick={onClick || (() => navigate(`${routeNames.foodMenu.detailed.fromMain}${food.id}`))}
            cover={
                <Image
                    preview={false}
                    alt={getLocalizedText(food, 'name', i18n.language)}
                    src={`${AxiosConstants.AXIOS_BASEURL}/${food.imagePath}`}
                    style={{
                        height: '30vh',
                        objectFit: 'cover',
                        borderRadius: '10px 10px 0 0',
                        padding: '20px 10px 10px 10px'
                    }}
                />
            }
            style={{
                textAlign: 'center',
                borderRadius: '10px',
                height: '100%',
            }}
            styles={{ body: { padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' } }}
        >
            {/* Title with Two-Line Limit */}
            <Title
                style={{
                    fontSize: '1vw',
                    textAlign: 'center',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2, 
                    overflow: 'hidden',
                    maxWidth: '100%',
                    height: '3vw',
                }}
            >
                {getLocalizedText(food, 'name', i18n.language)}
            </Title>

            {/* Bigger Add to Cart Button */}
            <Button
                shape='circle'
                type="text"
                icon={<PlusOutlined />}
                onClick={(e) => {
                    e.stopPropagation();
                    addToCart({ ...food, options: [] });
                }}
                style={{
                    width: '3vw',
                    height: '3vw',
                    minWidth: '40px',
                    minHeight: '40px',
                    fontSize: '1.5vw',
                    border: 'none',
                    color: 'red',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    margin: '10px 0 '
                }}
            />

            {/* Food Price Below Button */}
            <Paragraph style={{ fontWeight: 'bold', color: 'rgba(255, 127, 127, 1)', fontSize: '1vw' }}>
                {food.basePrice.toLocaleString()} VND
            </Paragraph>
        </Card>
    );
};

export default FoodCard;
