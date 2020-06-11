import React, { useRef, useState, useEffect } from 'react';
import styled from "styled-components";
import './Slider.css';
import {useSpring, animated} from 'react-spring';

const StyledSlider = styled.div`
  position: relative;
  border-radius: 3px;
  background: #dddddd;
  height: 5px;
  width: ${props => props.width};
`;

const StyledThumb = styled(animated.div)`
  width: 10px;
  height: 15px;
  border-radius: 3px;
  position: relative;
  top: -5px;
  opacity: 0.8;
  background: #002266;
  cursor: pointer;
`;

const Tick = styled.div`
    position: absolute;
    border-left: solid #888888;
    height: 10px;
    width: 1px;
    left: ${props => props.x};
`;

const Label = styled.p`
    position: absolute;
    left: ${props => props.x};
    color: #888888;
    font-size: 15px;
    user-select: none;
`;


function generateNumericLabels (points, div_width, point_start_val) {

    return (
        [points.map(point => (
            <Tick key = {point.val} x = {`${(point.val - point_start_val) * div_width}px`}/>
            )
        ),
        points.map(point => (
                <Label key = {point.label} x = {`${((point.val - point_start_val) * div_width) - 3}px`}>{point.label}</Label>
            )
        )
        ]
    );
}

function generateTextLabels (points, div_width) {

    return (
        [points.map((point, index) => (
            <Tick key = {point.val} x = {`${index * div_width}px`}/>
            )
        ),
        points.map((point, index) => (
                <Label key = {point.label} x = {`${(index * div_width) - 3}px`}>{point.label}</Label>
            )
        )
        ]
    );
}


function xPositionToValue(ref, div_width, start_val){ 
    return (start_val + (ref/div_width));
}

function nearestValue(refval, points){
    let [min, val, index] = [Infinity, null, 0];
    let i = 0;
    for (let point of points) {

        let diff = Math.abs(point.val - refval);
        if (diff < min) {
        min = diff;
        val = point.val;
        index = i;
        }

        i = i + 1;
    }
    return [val, index];
}

export default function Slider(props) {

    const containerRef = useRef(null);

    let sorted_points = [...props.points].sort((p1, p2) => p1.val - p2.val);

    const [thumbXPos, setThumbXPos] = useState(0);
    const [thumbValue, setThumbValue] = useState(props.isText ? props.points[0].val : sorted_points[0].val);
    const [isMouseDown, setIsMouseDown] = useState(0);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [startValue, setStartValue] = useState(props.isText ? 0 : sorted_points[0].val);
    const [endValue, setEndValue] = useState(props.isText ? 0 : sorted_points[sorted_points.length - 1].val);
    const [divisionWidth, setDivisionWidth] = useState(props.isText ? props.width/(props.points.length - 1) : props.width/(endValue - startValue));
    const [index, setIndex] = useState(0);
        

    useEffect(() => {
        const rect = containerRef.current.getBoundingClientRect();
        setOffsetLeft(rect.left);
    }, []);

  
    function handleDragEnter(e) {
        setIsMouseDown(true);
        setThumbXPos(e.nativeEvent.clientX - offsetLeft);

        if(!props.isText){
            let refval = xPositionToValue(e.nativeEvent.clientX - offsetLeft, divisionWidth, startValue);
            let valindexpair = nearestValue(refval, props.points);
            
            setThumbValue(valindexpair[0]);
            setIndex(valindexpair[1]);
        }else{
            let i = Math.round((e.nativeEvent.clientX - offsetLeft)/divisionWidth);
            setIndex(i);
            setThumbValue(props.points[i].val);
        }
    }


    function handleDragExit(e) {
        if(!isMouseDown){
            return;
        }

        setIsMouseDown(false);

        if (!props.isText){
            let refval = xPositionToValue(e.nativeEvent.clientX - offsetLeft, divisionWidth, startValue);
            console.log(refval);
            let valindexpair = nearestValue(refval, props.points);
            console.log(valindexpair);
            setThumbValue(valindexpair[0]);
            setThumbXPos((valindexpair[0] - startValue)*divisionWidth);
            setIndex(valindexpair[1]);
            
        }else{
            let i = Math.round((e.nativeEvent.clientX - offsetLeft)/divisionWidth);
            setIndex(i);
            setThumbValue(props.points[i].val);
            setThumbXPos(i*divisionWidth);
        }
    }

    function handleDragThrough(e) {
        if(isMouseDown){
            setThumbXPos(e.nativeEvent.clientX - offsetLeft);
            if(!props.isText){
                let refval = xPositionToValue(e.nativeEvent.clientX - offsetLeft, divisionWidth, startValue);
                let valindexpair = nearestValue(refval, props.points);
                setThumbValue(valindexpair[0]);
                setIndex(valindexpair[1]);
            }else{
                let i = Math.round((e.nativeEvent.clientX - offsetLeft)/divisionWidth);
                setIndex(i);
                setThumbValue(props.points[i].val);
            }
        }
    }

    
    return (
        <div className = "container" onMouseDown = {handleDragEnter} onMouseUp = {handleDragExit} onMouseMove = {handleDragThrough} onMouseLeave = {handleDragExit} ref = {containerRef}>
            <StyledSlider width = {`${props.width}px`} >
                <StyledThumb style={{left: `${thumbXPos - 3}px`}}/>
                {props.isText ? generateTextLabels(props.points, divisionWidth) : generateNumericLabels(props.points, divisionWidth, startValue)}
            </StyledSlider>
        </div>
    );
}

