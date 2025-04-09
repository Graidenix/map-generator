import './App.css'
import plainText from './levels/level1.text';
// import plainText from './levels/level2.text';
// import plainText from './levels/intro.text';

const items = plainText.trim().replace(/\n/gm, '').split('');

function App() {
  
  
  console.log(items);
  
  return (
    <div className="map-wrapper">
      {items.map((c,i) => <div key={i} className={`cell cell-${c}`} />)}
    </div>
  )
}

export default App
