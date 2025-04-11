import React, {useEffect, useRef, useState} from 'react';
import {CHARACTERS} from '../constants';

interface LegendProps {
    sprite: HTMLImageElement;
    frameSize: { width: number; height: number };
    isFrameTransparent: (ctx: CanvasRenderingContext2D, x: number, y: number) => boolean;
    onCharacterClick: (char: string) => void; // Callback for character click
}

const Legend: React.FC<LegendProps> = ({sprite, frameSize, isFrameTransparent, onCharacterClick}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [clickableZones, setClickableZones] = useState<
        { x: number; y: number; width: number; height: number; char: string }[]
    >([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rows = Math.ceil(sprite.height / frameSize.height);
        const cols = Math.ceil(sprite.width / frameSize.width);
        canvas.width = cols * frameSize.width;
        canvas.height = rows * frameSize.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let charIndex = 0;
        const zones: { x: number; y: number; width: number; height: number; char: string }[] = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const frameX = col * frameSize.width;
                const frameY = row * frameSize.height;

                // Skip fully transparent frames
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                if (!tempCtx) continue;

                tempCanvas.width = sprite.width;
                tempCanvas.height = sprite.height;
                tempCtx.drawImage(sprite, 0, 0);

                if (isFrameTransparent(tempCtx, frameX, frameY)) continue;

                // Draw the frame
                ctx.drawImage(
                    sprite,
                    frameX,
                    frameY,
                    frameSize.width,
                    frameSize.height,
                    col * frameSize.width,
                    row * frameSize.height,
                    frameSize.width,
                    frameSize.height
                );

                // Add the character label
                const char = CHARACTERS[charIndex] || '';
                if (char) {
                    ctx.fillStyle = 'white';
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(char, col * frameSize.width + frameSize.width / 2, row * frameSize.height + frameSize.height / 2);

                    // Store clickable zone
                    zones.push({
                        x: col * frameSize.width,
                        y: row * frameSize.height,
                        width: frameSize.width,
                        height: frameSize.height,
                        char,
                    });
                }

                charIndex++;
            }
        }

        setClickableZones(zones); // Save clickable zones
    }, [sprite, frameSize, isFrameTransparent]);

    // Handle clicks on the legend
    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const mouseX = (event.clientX - rect.left) * scaleX;
        const mouseY = (event.clientY - rect.top) * scaleY;

        for (const zone of clickableZones) {
            if (
                mouseX >= zone.x &&
                mouseX <= zone.x + zone.width &&
                mouseY >= zone.y &&
                mouseY <= zone.y + zone.height
            ) {
                onCharacterClick(zone.char); // Trigger callback with clicked character
                break;
            }
        }
    };

    return (
        <article className="message">
            <div className="message-header">
                <strong>Legend:</strong>
            </div>
            <div className="legend-canvas message-body">
                <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick} // Add click handler
                />
            </div>
        </article>
    );
};

export default Legend;
