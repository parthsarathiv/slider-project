import React, { useRef, useState, useEffect } from 'react';
import styled from "styled-components";
import {Spring} from 'react-spring/renderprops'


const SliderContainer = styled.div`
    width: fit-content;
    height: ${props => (props.labeled && props.noTicked) ? "60px" : props.labeled ? "80px" : props.noTicked ? "40px" : "60px"};
`;

const SubContainer2 = styled.div`
    padding-top: 10px;
    height: 50px;
`;

const StyledSlider = styled.div`
  position: relative;
  border-radius: 3px;
  background: #dddddd;
  height: 5px;
  width: ${props => props.width};
`;

const StyledValueLabel = styled.p`
    display: inline;
    user-select: none;
`;

const StyledThumb = styled.div`
  width: 10px;
  height: 15px;
  border-radius: 3px;
  position: relative;
  top: -5px;
  opacity: 0.8;
  background: ${props => props.disabled ? "#404040" : "#002266"};
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
        if(containerRef.current){
            const rect = containerRef.current.getBoundingClientRect();
            setOffsetLeft(rect.left);
        }
    }, []);

    if(props.hide){
        return null;
    }

    if(props.disabled) {
        return (
            <SliderContainer labeled = {(props.showControls||props.label)} noTicked = {props.showTicks === false} ref = {containerRef}>
                <div style = {{height: (props.showControls||props.label) ? "20px": "0px"}}>
                    {props.label? <StyledValueLabel>{props.points[index].val}</StyledValueLabel> : null}
                    {props.showControls? <>
                    <button style = {{float: "right", userSelect: "none"}} onClick = {handleNext} disabled>Next</button>
                    <button style = {{float: "right", userSelect: "none"}} onClick = {handlePrevious} disabled>Prev</button>
                    </> : null}
                </div>
                <SubContainer2>
                    <StyledSlider width = {`${props.width}px`} >
                    <StyledThumb disabled style={{left: `${-3}px`}}/>
                    {(props.showTicks === false) ? null : (props.isText ? generateTextLabels(props.points, divisionWidth) : generateNumericLabels(props.points, divisionWidth, startValue))}
                    </StyledSlider>
                </SubContainer2>
            </SliderContainer>
        );
    }

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

    function handleNext(e) {
        if(index === props.points.length - 1){
            return;
        }

        if(!props.isText){
            setThumbXPos(props.points[index+1].val * divisionWidth);
        }else{
            setThumbXPos((index+1)*divisionWidth);
        }

        setThumbValue(props.points[index+1].val);
        setIndex(index + 1);
    }

    function handlePrevious(e) {
        if(index === 0){
            return;
        }

        if(!props.isText){
            setThumbXPos(props.points[index-1].val * divisionWidth);
        }else{
            setThumbXPos((index-1)*divisionWidth);
        }

        setThumbValue(props.points[index-1].val);
        setIndex(index - 1);
    }
    
    return (
        <SliderContainer  ref = {containerRef} labeled = {(props.showControls||props.label)} noTicked = {props.showTicks === false}>
            <div style = {{height: (props.showControls||props.label) ? "20px": "0px"}}>
                {props.label? <StyledValueLabel>{props.points[index].val}</StyledValueLabel> : null}
                {props.showControls? <>
                <button style = {{float: "right", userSelect: "none"}} onClick = {handleNext}>Next</button>
                <button style = {{float: "right", userSelect: "none"}} onClick = {handlePrevious}>Prev</button>
                </> : null}
            </div>
            <SubContainer2 onMouseDown = {handleDragEnter} onMouseUp = {handleDragExit} onMouseMove = {handleDragThrough} onMouseLeave = {handleDragExit}>
                <StyledSlider width = {`${props.width}px`} >
                <Spring
                    to={{ x: thumbXPos }}>
                    {props => <StyledThumb style={{left: `${props.x - 3}px`}}/>}
                </Spring>
                {(props.showTicks === false) ? null : (props.isText ? generateTextLabels(props.points, divisionWidth) : generateNumericLabels(props.points, divisionWidth, startValue))}
                </StyledSlider>
            </SubContainer2>
        </SliderContainer>
    );
}

