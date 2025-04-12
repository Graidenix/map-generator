import React from 'react';
import './Legend.css';

interface LegendProps {
    charToImageMap: Map<string, HTMLImageElement>;
    onCharacterClick: (char: string) => void; // Callback for character click
}

const Legend: React.FC<LegendProps> = ({ charToImageMap, onCharacterClick }) => {

    console.log(charToImageMap);
    return (
        <div className="legend">
            {Array.from(charToImageMap.entries()).map(([char, image]) => (
                <button
                    key={char}
                    className="legend__button"
                    onClick={() => onCharacterClick(char)} // Trigger callback with clicked character
                >
                    <img src={image.src} alt={`Frame for ${char}`} className="legend__icon" />
                    <strong className="legend__char">{char}</strong>
                </button>
            ))}
        </div>
    );
};

export default Legend;
