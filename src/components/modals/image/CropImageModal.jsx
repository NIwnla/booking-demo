import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button, Modal, Slider } from "antd";
import getCroppedImg from "../../../helpers/getCroppedImg";

const CropImageModal = ({ visible, imageSrc, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirmCrop = async () => {
        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
        onCropComplete(croppedBlob);
        onClose();
    };

    return (
        <Modal
            title="Crop Image"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <div style={{ position: "relative", height: 300, background: "#333" }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                />
            </div>
            <Slider
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={setZoom}
                style={{ marginTop: 16 }}
            />
            <Button type="primary" onClick={handleConfirmCrop}>
                Confirm Crop
            </Button>
        </Modal>
    );
};

export default CropImageModal;
