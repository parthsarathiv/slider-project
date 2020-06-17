import React from 'react';
import styled from "styled-components";
import './Slider.css';
import {Spring} from 'react-spring/renderprops'
// .sliderContainer {
//     width: fit-content;
//     height: 100px;
//   }
// .subContainer1{
//   height: 20px;
// }

// .subContainer2 {
//   padding-top: 10px;
//   height: 50px;
// }


// const sliderContainer = styled.div`
//     width: fit-content;
//     height: 100px;
// `;

// const subContainer1 = styled.div`
//     height: 20px;
// `;
// const subContainer2 = styled.div`
// padding-top: 10px;
// height: 50px;
// `;

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


function genNumericLabels (points, div_width, point_start_val) {

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

function genTextLabels (points, div_width) {

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


function posToVal(ref, div_width){
    return ref/div_width;
}

function nearestVal(refval, points){
    let [min, val] = [Infinity, null];

    for (let point of points) {
        let diff = Math.abs(point.val - refval);
        if (diff < min) {
        min = diff;
        val = point.val;
        }
    }
    return val;
}

export default class Slider extends React.Component {
  constructor(props) {
    super(props);


    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragExit = this.handleDragExit.bind(this);
    this.handleDragThrough = this.handleDragThrough.bind(this);

    this.containerRef = React.createRef();

    this.state = {
        thumbxpos: 0,
        thumbval: 0,
        mousedown: false,
        offsetLeft: 0,
        point_start_val: 0,
        point_end_val: 0,
        div_width: 0,
    }

  }
  componentDidMount(){
    const rect = this.containerRef.current.getBoundingClientRect();
    //console.log(rect.left);
    if (!this.props.isText){
        let sorted_points = [...this.props.points].sort((p1, p2) => p1.val - p2.val);
        let point_start_val = sorted_points[0].val;
        let point_end_val = sorted_points[sorted_points.length - 1].val;
        let div_width = this.props.width/(point_end_val - point_start_val);
        this.setState({offsetLeft: rect.left, point_start_val, point_end_val, div_width, thumbval: point_start_val});
    }else {
        let div_width = this.props.width/(this.props.points.length - 1);
        this.setState({offsetLeft: rect.left, div_width});
    }
  }

  handleDragEnter(e) {
    this.setState({mousedown: true, thumbxpos: e.nativeEvent.clientX - this.state.offsetLeft});
  }
  handleDragExit(e) {
    if(!this.state.mousedown){
        return;
    }
    if (!this.props.isText){
        let refval = posToVal(e.nativeEvent.clientX - this.state.offsetLeft, this.state.div_width);
        //console.log(refval);
        let thumbval = nearestVal(refval, this.props.points);
        this.setState({mousedown: false, thumbval, thumbxpos: (thumbval - this.state.point_start_val)*this.state.div_width});
    }else{
        let thumbval = Math.round((e.nativeEvent.clientX - this.state.offsetLeft)/this.state.div_width)
        this.setState({mousedown: false, thumbval: this.props.points[thumbval].val, thumbxpos: (thumbval)*this.state.div_width});
    }
  }

  handleDragThrough(e) {
    //console.log(e.nativeEvent.offsetX);
    if(this.state.mousedown){
        this.setState({thumbxpos: e.nativeEvent.clientX - this.state.offsetLeft});
    }
  }


  render() {

    
    return (
        <div className = "container" onMouseDown = {this.handleDragEnter} onMouseUp = {this.handleDragExit} onMouseMove = {this.handleDragThrough} onMouseLeave = {this.handleDragExit} ref = {this.containerRef}>
            <StyledSlider width = {`${this.props.width}px`} >
                <Spring
                    to={{ newx: this.state.thumbxpos}}>
                    {props => <StyledThumb style={{left: `${props.newx - 3}px`}}/>}
                </Spring>
                {this.props.isText ? genTextLabels(this.props.points, this.state.div_width) : genNumericLabels(this.props.points, this.state.div_width, this.state.point_start_val)}
            </StyledSlider>
        </div>
    );
  }
}

