import React from 'react';
import Slider from './SliderHooks';
import './App.css';

function App() {
  return (

    <div className = "conatiner">
      <p>This is a slider</p>
      <Slider isText = {false} height = {20} width = {500} points={[
        { val: 0, label: "0" },
        { val: 7, label: "7" },
        { val: 12, label: "12" },
        { val: 17, label: "17" },
        { val: 19, label: "19" }
      ]}/>
      <p>Second slider</p>
      <Slider isText = {true} height = {20} width = {500} points={[
        { val: "Dog", label: "Dog" },
        { val: "Cat", label: "Cat" },
        { val: "Horse", label: "Horse" },
        { val: "Emu", label: "Emu" }
      ]}/>
    </div>
  );
}

export default App;
