import React, { useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface Step4aSplitFramesProps {
    sprite: HTMLImageElement;
    frameSize: { width: number; height: number };
}

const Step4aSplitFrames: React.FC<Step4aSplitFramesProps> = ({ sprite, frameSize }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleDownload = async () => {
        const zip = new JSZip();
        const canvas = canvasRef.current;

        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rows = Math.floor(sprite.height / frameSize.height);
        const cols = Math.floor(sprite.width / frameSize.width);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                ctx.clearRect(0, 0, frameSize.width, frameSize.height);
                ctx.drawImage(
                    sprite,
                    x * frameSize.width,
                    y * frameSize.height,
                    frameSize.width,
                    frameSize.height,
                    0,
                    0,
                    frameSize.width,
                    frameSize.height
                );

                const dataUrl = canvas.toDataURL('image/png');
                const blob = await fetch(dataUrl).then((res) => res.blob());
                zip.file(`frame_${y}_${x}.png`, blob);
            }
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, 'frames.zip');
        });
    };

    return (
        <div>
            <button onClick={handleDownload}>Download Frames as ZIP</button>
            <canvas ref={canvasRef} width={frameSize.width} height={frameSize.height} style={{ display: 'none' }} />
        </div>
    );
};

export default Step4aSplitFrames;
