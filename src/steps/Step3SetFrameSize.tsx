import React, {useLayoutEffect, useState} from 'react';

interface Step3SetFrameSizeProps {
    value: { width: number; height: number }
    onNext: (frameSize: { width: number; height: number }) => void;
}

const Step3SetFrameSize: React.FC<Step3SetFrameSizeProps> = ({onNext, value}) => {
    const [frameWidth, setFrameWidth] = useState<string>((value.width ?? '32').toString());
    const [frameHeight, setFrameHeight] = useState<string>((value.height ?? '32').toString());

    useLayoutEffect(() => {
        if (!value) return;
        setFrameHeight(value.height + '');
        setFrameWidth(value.width + '');
    }, [value]);

    const handleSubmit = () => {
        const width = +frameWidth;
        const height = +frameHeight;
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            console.error('Invalid frame size');
            return;
        }
        onNext({width, height});
    };

    return (
        <div className="card">
            <div className="card-content columns">
                <div className="column field">
                    <label className="label">
                        Width:
                    </label>
                    <input
                        className="input"
                        type="number"
                        value={frameWidth}
                        onChange={(e) => setFrameWidth(e.target.value)}
                    />
                </div>
                <div className="column field">
                    <label className="label">
                        Height:
                    </label>
                    <input
                        className="input"
                        type="number"
                        value={frameHeight}
                        onChange={(e) => setFrameHeight(e.target.value)}
                    />
                </div>
            </div>
            <footer className="card-footer">
                <button className="card-footer-item" onClick={handleSubmit}>Next</button>
            </footer>
        </div>
    );
};

export default Step3SetFrameSize;
