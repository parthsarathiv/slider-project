import React from 'react';
import styled from "styled-components";
import './Slider.css';

const StyledSlider = styled.div`
  position: relative;
  border-radius: 3px;
  background: #dddddd;
  height: 5px;
  width: ${props => props.width};
`;
 
const StyledThumb = styled.div`
  width: 10px;
  height: 15px;
  border-radius: 3px;
  position: relative;
  top: -5px;
  left: ${props => props.x };
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
`;


function genNumericLabels (points, parentwidth) {
    
    let sorted_points = [...points].sort((p1, p2) => p1.val - p2.val);
    let point_start_val = sorted_points[0].val;
    let point_end_val = sorted_points[points.length - 1].val;
    let div_width = parentwidth/(point_end_val - point_start_val);

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

function genTextLabels (points, parentwidth) {
    
    let div_width = parentwidth/(points.length);

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



export default class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.handleInput = this.handleInput.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragExit = this.handleDragExit.bind(this);
    this.handleDragThrough = this.handleDragThrough.bind(this);

    this.thumbRef = React.createRef();

    this.state = {
        thumbxpos: 0,
        mousedown: false,
    }

  }
  handleInput(e, inputState) {

  }

  handleDragEnter(e) {
    console.log(e.nativeEvent.offsetX);
    
    this.setState({mousedown: true, thumbxpos: e.nativeEvent.offsetX});
  }
  handleDragExit(e) {
    //console.log(e.nativeEvent.offsetX);
    
    this.setState({mousedown: false});
  }

  handleDragThrough(e) {
    //console.log(e.nativeEvent.offsetX);
    if(this.state.mousedown){
        this.setState({thumbxpos: e.nativeEvent.offsetX});
    }
  }


  render() {

    
    return (
        <div className = "container" onMouseDown = {this.handleDragEnter} onMouseUp = {this.handleDragExit} onMouseMove = {this.handleDragThrough}>
            <StyledSlider width = {`${this.props.width}px`} >
                <StyledThumb 
                    x = {`${this.state.thumbxpos - 3}px`}
                    ref = {this.thumbRef}
            />
                {this.props.isText ? genTextLabels(this.props.points, this.props.width) : genNumericLabels(this.props.points, this.props.width)}
            </StyledSlider>
        </div>
    );
  }
}