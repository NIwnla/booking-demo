const getCroppedImg = (imageSrc, crop) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous"; // Prevent CORS issues
        image.src = imageSrc;

        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Set canvas size to the crop dimensions
            canvas.width = crop.width;
            canvas.height = crop.height;

            // Draw the cropped image onto the canvas
            ctx.drawImage(
                image,
                crop.x, // Source x
                crop.y, // Source y
                crop.width, // Source width
                crop.height, // Source height
                0, // Target x
                0, // Target y
                crop.width, // Target width
                crop.height // Target height
            );

            // Convert the canvas content to a Blob
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error("Canvas is empty or failed to create Blob."));
                        return;
                    }
                    resolve(blob); // Return the Blob for uploading
                },
                "image/jpeg", // MIME type
                1 // Image quality (optional, between 0 and 1)
            );
        };

        image.onerror = (err) => {
            // @ts-ignore
            reject(new Error("Failed to load the image. " + err.message));
        };
    });
};

export default getCroppedImg;
