// Imports for libs
import React, {useState} from 'react';

// Local imports
import Step3SetFrameSize from './steps/Step3SetFrameSize';
import Step4aSplitFrames from './steps/Step4aSplitFrames';
import Step4bMapGenerator from './steps/Step4bMapGenerator';

import './App.css'
import ImageUpload from "./components/ImageUpload.tsx";

const App: React.FC = () => {
    const [flowType, setFlowType] = useState<'split' | 'map' | null>(null);
    const [sprite, setSprite] = useState<HTMLImageElement | null>(null);
    const [frameSize, setFrameSize] = useState<{ width: number; height: number }>({width: 32, height: 32});

    const loadSprite = (file: File) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            setSprite(img);
            setFrameSize({width: img.width, height: img.height});
        }

    };

    return (
        <main className="container">
            <section className="hero is-primary">
                <div className="hero-body">
                    <h1 className="title">Sprite Tool Wizard</h1>
                </div>
            </section>
            <div className="card">
                <div className="card-content">
                    <div className="tabs">
                        <ul>
                            <li className={flowType === 'split' ? 'is-active' : ''}>
                                <a onClick={() => setFlowType('split')}>Split Sprite</a>
                            </li>
                            <li className={flowType === 'map' ? 'is-active' : ''}>
                                <a onClick={() => setFlowType('map')}>Generate Background</a>
                            </li>
                        </ul>
                    </div>
                    {!!flowType && <>
                        <ImageUpload onChange={(f) => loadSprite(f)}/>
                        <Step3SetFrameSize value={frameSize} onNext={(size) => setFrameSize(size)}/>
                    {Boolean(flowType === "split" && sprite) &&
                        <Step4aSplitFrames sprite={sprite!} frameSize={frameSize}/>}
                    {Boolean(flowType === "map" && sprite) &&
                        <Step4bMapGenerator sprite={sprite!} frameSize={frameSize}/>}
                    </>}
                </div>
            </div>
        </main>
    );
};

export default App;
