import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';

const ImageCropper = ({ imageSrc, onDone }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);


    const onCropCompleteHandler = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const finishCrop = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onDone(croppedImage);
        } catch (e) {
            console.error(e);
        }
    }, [croppedAreaPixels, imageSrc]);

    return (
        <div>
            <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={0.63}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropCompleteHandler}
            />

            <button onClick={finishCrop}>Finish</button>
            {/*<button onClick={() => onDone(null)}>Cancel</button>*/}
        </div>
    );
};

export default ImageCropper;
