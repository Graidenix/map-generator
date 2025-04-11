import React, {useEffect, useRef, useState} from 'react';
import Legend from '../components/Legend';
import {CHARACTERS} from '../constants';

interface Step4bMapGeneratorProps {
    sprite: HTMLImageElement;
    frameSize: { width: number; height: number };
}

const Step4bMapGenerator: React.FC<Step4bMapGeneratorProps> = ({sprite, frameSize}) => {
    const [mapConfig, setMapConfig] = useState('');
    const [mapSize, setMapSize] = useState({width: 20, height: 15});
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    // Function to check if a frame is fully transparent
    const isFrameTransparent = (ctx: CanvasRenderingContext2D, x: number, y: number): boolean => {
        const imageData = ctx.getImageData(x, y, frameSize.width, frameSize.height).data;
        for (let i = 3; i < imageData.length; i += 4) {
            if (imageData[i] !== 0) return false; // Not fully transparent
        }
        return true; // Fully transparent
    };

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
                const frameIndex = CHARACTERS.indexOf(char);
                if (frameIndex < 0) return; // Skip invalid characters

                let frameCount = 0;
                let foundFrame = false;

                for (let rowIdx = 0; rowIdx < Math.ceil(sprite.height / frameSize.height); rowIdx++) {
                    for (let colIdx = 0; colIdx < Math.ceil(sprite.width / frameSize.width); colIdx++) {
                        const frameX = colIdx * frameSize.width;
                        const frameY = rowIdx * frameSize.height;

                        // Skip fully transparent frames
                        const tempCanvas = document.createElement('canvas');
                        const tempCtx = tempCanvas.getContext('2d');
                        if (!tempCtx) continue;

                        tempCanvas.width = sprite.width;
                        tempCanvas.height = sprite.height;
                        tempCtx.drawImage(sprite, 0, 0);

                        if (isFrameTransparent(tempCtx, frameX, frameY)) continue;

                        if (frameCount === frameIndex) {
                            ctx.drawImage(
                                sprite,
                                frameX,
                                frameY,
                                frameSize.width,
                                frameSize.height,
                                x * frameSize.width,
                                y * frameSize.height,
                                frameSize.width,
                                frameSize.height
                            );
                            foundFrame = true;
                            break;
                        }

                        frameCount++;
                    }
                    if (foundFrame) break;
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
                    sprite={sprite}
                    frameSize={frameSize}
                    isFrameTransparent={isFrameTransparent}
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
