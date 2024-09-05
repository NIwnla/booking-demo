import React from "react";
import { Modal, Row, Col, Card } from "antd";
import { AxiosConstants } from "../../../constaints/axiosContaint";

const FoodDetailModal = ({ food, visible, onClose }) => {
    return (
        <Modal
            title={`Food Details: ${food.name}`}
            open={visible}
            footer={null}
            onCancel={onClose}
        >
            <Row gutter={[16, 16]}>
                {food.options.map((option) => (
                    <Col key={option.id} xs={24} sm={12}>
                        <Card
                            hoverable
                            cover={<img alt={option.name} src={`${AxiosConstants.AXIOS_BASEURL}/${option.imagePath}`} />}
                        >
                            <Card.Meta title={option.name} description={`Additional Price: ${option.additionalPrice}`} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </Modal>
    );
};

export default FoodDetailModal;
