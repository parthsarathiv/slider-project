import React from 'react';
import Slider from './Slider';
import './App.css';

function App() {
  return (

    <div>
      <p>This is a slider</p>
      <Slider isText = {false} height = {20} width = {500} points={[
        { val: 1, label: "1" },
        { val: 7, label: "7" },
        { val: 12, label: "12" },
        { val: 17, label: "17" },
        { val: 19, label: "19" }
      ]}/>
    </div>
  );
}

export default App;
