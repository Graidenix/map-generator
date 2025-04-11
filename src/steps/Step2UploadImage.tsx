import React, {useState} from 'react';

interface Step2UploadImageProps {
    onNext: (file: File) => void;
}

const Step2UploadImage: React.FC<Step2UploadImageProps> = ({onNext}) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) {
            console.error('Only image files are supported.');
            return;
        }

        // Generate preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onNext(file!);

        // Load image to get dimensions
        const img = new Image();
        img.src = url;
        img.onload = () => {
            setImageSize({width: img.width, height: img.height});

        };
    };

    return (
        <div className="image-upload">
            {/* Upload Button */}
            <label htmlFor="file-upload" role="button">
                Upload Image
            </label>
            <input
                id="file-upload"
                type="file"
                accept="image/*"
                style={{display: 'none'}}
                onChange={handleFileChange}
            />

            {/* Preview and Size */}
            {previewUrl && (
                <div className="image-preview">
                    <img src={previewUrl} alt="Preview" className="preview-image"/>
                    {imageSize && (
                        <p className="image-size">
                            Size: {imageSize.width}px × {imageSize.height}px
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Step2UploadImage;
