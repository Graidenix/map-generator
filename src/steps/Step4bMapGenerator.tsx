import React, {useEffect, useMemo, useRef, useState} from 'react';
import Legend from '../components/Legend';
import {CHARACTERS} from '../constants';

interface Step4bMapGeneratorProps {
    sprite: HTMLImageElement;
    frameSize: { width: number; height: number };
}

// Function to check if a frame is fully transparent
const isFrameTransparent = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): boolean => {
    const imageData = ctx.getImageData(x, y, width, height).data;
    for (let i = 3; i < imageData.length; i += 4) {
        if (imageData[i] !== 0) return false; // Not fully transparent
    }
    return true; // Fully transparent
};


const Step4bMapGenerator: React.FC<Step4bMapGeneratorProps> = ({sprite, frameSize}) => {
    const [mapConfig, setMapConfig] = useState('');
    const [mapSize, setMapSize] = useState({width: 20, height: 15});
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);


    const charToImageMap = useMemo(() => {
        const charMap = new Map<string, HTMLImageElement>();
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sprite.width;
        tempCanvas.height = sprite.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return charMap;

        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = frameSize.width;
        frameCanvas.height = frameSize.height;
        const frameCtx = frameCanvas.getContext('2d');
        if (!frameCtx) return charMap;

        tempCtx.drawImage(sprite, 0, 0);

        const rows = Math.ceil(sprite.height / frameSize.height);
        const cols = Math.ceil(sprite.width / frameSize.width);

        let charIndex = 0;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const frameX = col * frameSize.width;
                const frameY = row * frameSize.height;

                // Skip fully transparent frames
                if (isFrameTransparent(tempCtx, frameX, frameY, frameSize.width, frameSize.height)) continue;

                frameCtx.clearRect(0, 0, frameSize.width, frameSize.height);
                frameCtx.drawImage(
                    sprite,
                    frameX,
                    frameY,
                    frameSize.width,
                    frameSize.height,
                    0,
                    0,
                    frameSize.width,
                    frameSize.height
                );

                const img = new Image();
                const char = CHARACTERS[charIndex];
                // Convert the frame canvas to a Blob and load it as an HTMLImageElement
                frameCanvas.toBlob((blob) => {
                    if (blob) {
                        img.src = URL.createObjectURL(blob);
                        if (char) {
                            charMap.set(char, img);
                        }
                    }
                }, 'image/png');

                charIndex++;
            }
        }

        return charMap;
    }, [sprite, frameSize]); // Recompute only when sprite or frameSize changes

    console.log(charToImageMap);

    // Render the map preview
    const renderPreview = () => {
        const canvas = previewCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rows = mapConfig.split('\n');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        rows.forEach((row, y) => {
            row.split('').forEach((char, x) => {
                const frameImage = charToImageMap.get(char);
                if (frameImage) {
                    ctx.drawImage(
                        frameImage,
                        x * frameSize.width,
                        y * frameSize.height,
                        frameSize.width,
                        frameSize.height
                    );
                }
            });
        });
    };

    useEffect(() => {
        renderPreview();
    }, [mapConfig, sprite, frameSize]);

    const handleDownload = () => {
        const canvas = previewCanvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'map.png';
        link.click();
    };

    const handleCharacterClick = (char: string) => {
        setMapConfig((prev) => {

            return prev + char
        }); // Append character to the map configuration
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-header-title">
                    Map Generation
                </div>
            </div>
            <div className="card-content">
                <div className="columns">
                    <div className="field column">
                        <label className="label">
                            Width:
                        </label>
                        <input
                            type="number"
                            value={mapSize.width}
                            onChange={(e) => setMapSize({...mapSize, width: parseInt(e.target.value, 10)})}
                            className="input"
                        />
                    </div>
                    <div className="field column">
                        <label className="label">
                            Height:
                        </label>
                        <input
                            type="number"
                            value={mapSize.height}
                            onChange={(e) => setMapSize({...mapSize, height: parseInt(e.target.value, 10)})}
                            className="input"
                        />
                    </div>
                </div>
                <div className="columns">
                    <div className="column">

                        <div className="field">
                            <label className="label">Text Map</label>
                            <div className="control">
                        <textarea
                            className="textarea has-fixed-size"
                            value={mapConfig}
                            onChange={(e) => setMapConfig(e.target.value)}
                            rows={mapSize.height}
                            cols={mapSize.width}
                        />
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="column">
                        <p><strong>Preview:</strong></p>
                        <canvas
                            ref={previewCanvasRef}
                            width={mapSize.width * frameSize.width}
                            height={mapSize.height * frameSize.height}
                            className="preview-canvas"
                        />
                    </div>
                </div>

                <Legend
                    charToImageMap={charToImageMap}
                    onCharacterClick={handleCharacterClick}
                />

            </div>
            <footer className="card-footer">
                <button className="card-footer-item" onClick={handleDownload}>Download Map</button>
            </footer>
        </div>
    );
};

export default Step4bMapGenerator;
