import React from 'react';
import Slider from './SliderHooks';
import './App.css';

function App() {
  return (

    <div className = "AppContainer">
      <p>Slider 1</p>
      <Slider isText = {false} height = {20} width = {500} points={[
        { val: 0, label: "0" },
        { val: 7, label: "7" },
        { val: 12, label: "12" },
        { val: 17, label: "17" },
        { val: 19, label: "19" }
      ]}/>
      <p>Slider 2</p>
      <Slider label isText = {true} height = {20} width = {300} points={[
        { val: "Dog", label: "Dog" },
        { val: "Cat", label: "Cat" },
        { val: "Horse", label: "Horse" },
        { val: "Emu", label: "Emu" }
      ]}/>

      <p>Slider 3</p>
      <Slider showControls isText = {false} height = {20} width = {500} points={[
        { val: 0, label: "0" },
        { val: 2, label: "2" },
        { val: 4, label: "4" },
        { val: 6, label: "6" },
        { val: 8, label: "8" },
        { val: 10, label: "10" }
      ]}/>

      <p>Slider 3.5</p>
      <Slider showTicks = {false} isText = {false} height = {20} width = {500} points={[
        { val: 0, label: "0" },
        { val: 2, label: "2" },
        { val: 4, label: "4" },
        { val: 6, label: "6" },
        { val: 8, label: "8" },
        { val: 10, label: "10" }
      ]}/>

      <p>Slider 4</p>
      <Slider label showTicks = {false} showControls isText = {false} height = {20} width = {500} points={[
        { val: 0, label: "0" },
        { val: 2, label: "2" },
        { val: 4, label: "4" },
        { val: 6, label: "6" },
        { val: 8, label: "8" },
        { val: 10, label: "10" }
      ]}/>


      <p>Slider 5</p>
      <Slider disabled label showControls isText = {false} height = {20} width = {400} points={[
        { val: 0, label: "0" },
        { val: 2, label: "2" },
        { val: 4, label: "4" },
        { val: 6, label: "6" },
        { val: 8, label: "8" },
        { val: 10, label: "10" }
      ]}/>

    </div>
  );
}

export default App;
