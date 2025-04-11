// components/ImageUploader.tsx
import React, {useState, useRef} from 'react';
import './ImageUpload.css'

interface ImageDetails {
    name: string;
    width: number;
    height: number;
    url: string;
}

interface Props {
    onChange: (file: File) => unknown;
}

const ImageUploader: React.FC<Props> = (props) => {
    const {onChange} = props;
    const [imageDetails, setImageDetails] = useState<ImageDetails | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        onChange(file);

        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            setImageDetails({
                name: file.name,
                width: img.width,
                height: img.height,
                url,
            });
        };

        img.src = url;
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="card">
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                style={{display: 'none'}}
            />
            <div className="card-content">
                <div className="columns">
                    <div className="column">
                        <img
                            src={imageDetails?.url ?? '/placeholder.jpg'}
                            alt="Preview"
                            className="preview-image"
                            onClick={handleClickUpload}
                        />
                    </div>
                    <div className="image-info column">
                        <p><strong>Filename:</strong> {imageDetails?.name}</p>
                        <p><strong>Width:</strong> {imageDetails?.width ?? 0}px</p>
                        <p><strong>Height:</strong> {imageDetails?.height ?? 0}px</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;
