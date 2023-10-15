import './App.css';
import BarChart from './components/BarChart';
import { Tag } from 'antd';

function App() {
  return (
    <div className="App">
      <Tag className="tag" color="processing">
        <h1>Graph Visualization and PDF Generator</h1>
        </Tag>

      <BarChart />
    </div>
  );
}

export default App;
