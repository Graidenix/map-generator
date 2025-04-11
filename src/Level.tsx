import * as React from "react";
import plainText from "./levels/level4.text";
// import plainText from './levels/level2.text';
// import plainText from './levels/level2.text';
// import plainText from './levels/level0.text';

const items: string[] = plainText.trim().replace(/\n/gm, '').split('');

const Level: React.FC = () => {
    return (<div className="map-wrapper">
        {items.map((c, i) => <div key={i} className={`cell cell-${c}`}/>)}
    </div>)
}

export default Level;
