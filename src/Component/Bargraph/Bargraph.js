import React from 'react'
import { letterFrequency } from '@vx/mock-data';
import { Group } from '@vx/group';
import { Bar, Line,LinePath } from '@vx/shape';
import { scaleLinear, scaleBand,scaleTime  } from '@vx/scale';
import { AxisLeft, AxisBottom } from '@vx/axis';
import {Motion,spring} from 'react-motion'
import {Transition} from 'react-transition-group';

class BarGraph extends React.Component {
  constructor(props){
    super(props)

    this.state =  {
      width:this.props.width,
      height:this.props.height,
      backgroundColor:this.props.backgroundColor,
      dataSet:this.props.dataSet,
      xScale :()=>{},
      yScale :()=>{},
      x:() => { },
      y:() => { },
      margin:this.props.margin,
      xMax:0,
      yMax:0,
      scaleOnX: this.props.scaleOnX,
      scaleOnY: this.props.scaleOnY,
      axisTickTextFill : this.props.axisTickTextFill,
      bottomLabel : this.props.bottomLabel,
      bottomStroke : this.props.bottomStroke,
      bottomTickStroke : this.props.bottomTickStroke,
      bottomTickLabelProps : {dy :this.props.bottomTickLabelProps.dy, textAnchor:this.props.bottomTickLabelProps.textAnchor,
                              fontFamily:this.props.bottomTickLabelProps.fontFamily,fontSize : this.props.bottomTickLabelProps.fontSize,
                              fill:this.props.bottomTickLabelProps.fill},
      leftLabel :this.props.leftLabel,
      leftLabelProps : { fontSize: this.props.leftLabelProps.fontSize, fill: this.props.leftLabelProps.fill },
      leftTickLabelProps : {dx: this.props.leftTickLabelProps.dx,fill: this.props.leftTickLabelProps.fill,fontSize: this.props.leftTickLabelProps.fontSize,
                            fontFamily: this.props.leftTickLabelProps.fontFamily}
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
  }

  decideScaleFunction = (key) => (dataSet,scaleFunc,maxValue) => {
    console.log(dataSet)                                                                    
    const conf = {
      bandScale: this.bandScale({dataSet,scaleFunc,maxValue}),
      timeScale: this.timeScale({dataSet,scaleFunc,maxValue}),
      linearScale: this.linearScale({dataSet,scaleFunc,maxValue})
    }                                                                                                                                                                                   
    return conf[key]
  }                                                                                             

  bandScale = ({dataSet,scaleFunc,maxValue}) => {
    console.log(dataSet)
   return  scaleBand({
      rangeRound: [0, maxValue],                                                                      
      domain: dataSet.map(scaleFunc),
      padding: 0.4,
    })
  }

  linearScale = ({dataSet,scaleFunc,maxValue}) => {
    return scaleLinear({
      rangeRound: [maxValue, 0],
      domain: [0, Math.max(...dataSet.map(scaleFunc))]
    })
  }

  timeScale = ({dataSet,scaleFunc,maxValue}) => {
   return scaleTime({
        rangeRound : [0,900], 
        domain: [new Date(2012, 4, 23), new Date(2012, 4, 26)],   
    });
  } 
  
  compose = (scale,accessor) => (data) => scale(accessor(data))
  

  componentDidMount = () => {
    
    const { width, height, backgroundColor, dataSet,margin, scaleOnX, scaleOnY ,axisColor,axisLabel,axisTickTextFill } = this.state                                 
    console.log(this.state)
    this.updateDataToState({ width, height, backgroundColor, dataSet,margin, scaleOnX, scaleOnY ,axisColor,axisLabel,axisTickTextFill})
  }

  componentWillReceiveProps = (nextProps) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    if(this.props.dataSet !== nextProps.dataSet){
      console.log(nextProps)

      const { width, height, backgroundColor, dataSet ,margin,scaleOnX,scaleOnY,axisColor,axisLabel,axisTickTextFill} = nextProps
      this.updateDataToState({ width, height, backgroundColor, dataSet,margin,scaleOnX,scaleOnY,axisColor,axisLabel,axisTickTextFill })
    }
  }
 
  updateDataToState = ({ width, height, backgroundColor, dataSet ,margin,scaleOnX,scaleOnY,axisColor,axisLabel,axisTickTextFill }) => {
    const {xScale, yScale, x, y,xMax,yMax} = 
            this.prepareDataForDisplay({width, height, dataSet,margin,scaleOnX,scaleOnY})
    this.setState({                                                                                                                                                                                                                                                                                                                                                                                                   
      width, height, backgroundColor, dataSet, xScale, yScale, x, y, margin,xMax,yMax,axisColor,axisLabel,axisTickTextFill
    })
  }

  prepareDataForDisplay = ({width, height, dataSet:d,margin, scaleOnX, scaleOnY }) => {
    console.log(margin)
    
     const xMax = width - margin.left - margin.right;
     const yMax = height - margin.top - margin.bottom;

    //  console.log(this.state.timeData.length);
    //  console.log(this.state.dataSet.length)
    
    const x = d => d.letter;
    const y = d => d.frequency * 100; 
    console.log(x)
    console.log(y)
    console.log(d);
    const xScale = this.decideScaleFunction(scaleOnX)(d,x,xMax)
    console.log(xScale)
    
     const yScale = this.decideScaleFunction(scaleOnY)(d,y,yMax);
     console.log(yScale)
    
    // const xPoint = compose(xScale, x);
    // const yPoint = compose(yScale, y);
    return { xScale, yScale, x, y,xMax,yMax }
  }


  render(){
    const { width, height, backgroundColor, dataSet, xScale, yScale, x, y ,margin,yMax,xMax,scaleOnX,scaleOnY,
            bottomLabel,bottomStroke,bottomTickLabelProps,bottomTickStroke,leftLabel,leftLabelProps,leftTickLabelProps} = this.state
    console.log(x)
    console.log(y)
    const config = {stiffness :18,damping:10}
    

    // const duration = 300;

    // const defaultStyle = {

    //   transition: `opacity ${duration}ms ease-in-out`,
    //   scale: -100,
    // }

    // const transitionStyles = {
    //   entering: { transform : `translateX(${1.8})` },
    //   entered:  { transform : `translateX(${1})`},
    // };
      const mybar = dataSet.map((d, i) => {
        const barHeight = yMax - this.compose(this.decideScaleFunction(scaleOnY)(dataSet,y,yMax),y)(d);

        
        return(
         <Group top={margin.top-20} left={margin.left+40}>
                  <AxisLeft
                    scale={this.decideScaleFunction(scaleOnY)(dataSet,y,yMax)}
                    top={0}
                    left={0}
                    label={leftLabel}
                    labelProps={{ fontSize: leftLabelProps.fontSize, fill: leftLabelProps.fill }}
                    tickFormat={(value, index) => `${value}`}
                    tickLabelProps={(value, index) => ({
                      dx: leftTickLabelProps.dx,
                      fill: leftTickLabelProps.fill,
                      fontSize: leftTickLabelProps.fontSize,
                      textAnchor: "end",
                       fontFamily: leftTickLabelProps.fontFamily, 
                    })}
                  />

    

            <AxisBottom
                  scale={this.decideScaleFunction(scaleOnX)(dataSet,x,xMax)}
                  top={yMax}
                  left={0}
                  axisClassName="axis-class"
                  labelClassName="axis-label-class"
                  tickClassName="tick-label-class"
                  label= {bottomLabel}
                  stroke={bottomStroke}
                  tickStroke={bottomTickStroke}
                  tickLabelProps={(val, i) => ({ dy: bottomTickLabelProps.dy, textAnchor: bottomTickLabelProps.textAnchor,
                                  fontFamily: bottomTickLabelProps.fontFamily, fontSize: bottomTickLabelProps.fontSize, fill: bottomTickLabelProps.fill })}
                />

            
            
              <Bar
                x={this.compose(this.decideScaleFunction(scaleOnX)(dataSet,x,xMax),x)(d)}
                y={this.compose(this.decideScaleFunction(scaleOnY)(dataSet,y,yMax),y)(d)}
                height={barHeight}
                width={this.decideScaleFunction(scaleOnX)(dataSet,x,xMax).bandwidth()}
                fill={"red"}
            />  
       </Group>
         );
        })

    return(

      
      <Motion defaultStyle={{x:-100}} style={{x: spring(10,config)}}>
        {value =>  <div  style={{transform : `translateX(${value.x}px)`}} >
                        {value.x}
                        <h3 className='' style={{color: 'white'}} > BAR GRAPH </h3>
                        <svg style={{ width:width, height:height }} >
                        {mybar}
                        </svg> 
                    </div>
        }
      </Motion>
     
     )
  }
}




export default BarGraph



// import React,{Component} from 'react'
//  import { letterFrequency } from '@vx/mock-data';
// import { Group } from '@vx/group';
// import { Bar, Line,LinePath } from '@vx/shape';
// import { scaleLinear, scaleBand } from '@vx/scale';
// import { AxisLeft, AxisBottom } from '@vx/axis';


// const data = letterFrequency;

// console.log(data)

// const width = 500;
// const height = 500;
// const margin = { top: 20, bottom: 20, left: 20, right: 20 };

// const xMax = width - margin.left - margin.right;
// const yMax = height - margin.top - margin.bottom;
// console.log(xMax)
// console.log(yMax)

// const x = d => d.letter;
// const y = d => d.frequency * 100; 

// const xScale = scaleBand({
//     rangeRound: [0, xMax],
//     domain: data.map(x),
//     padding: 0.4,
//   })
//   const yScale = scaleLinear({
//     rangeRound: [yMax, 0],
//     domain: [0, Math.max(...data.map(y))]
//   })

//   const compose = (scale, accessor) => (data) => scale(accessor(data));
// const xPoint = compose(xScale, x);
// const yPoint = compose(yScale, y);



// // Finally we'll embed it all in an SVG
// function BarGraph(props) {
//   return (

//     <div className='' >
//         <h3 className='' style={{color: 'white'}} > BAR GRAPH </h3>
//         <svg style={{ width:'800px', height:'2000px' }} >
            
//         {data.map((d, i) => {
//             const barHeight = yMax - yPoint(d);

//             return (
//             <Group key={`bar-${i}`} top={margin.top} left={margin.left+50}>

//                 <AxisLeft
//                       scale={yScale}
//                       top={0}
//                       left={0}
//                       label={'Close Price ($)'}
//                       stroke={'#1b1a1e'}
//                       tickTextFill={'#1b1a1e'}
//                     />

//                <AxisBottom
//                       scale={xScale}
//                       top={yMax}
//                       label={'Years'}
//                       stroke={'#1b1a1e'}
//                       tickTextFill={'#1b1a1e'}
//                  />

//                 <Bar
//                     x={xPoint(d)}
//                     y={yPoint(d)}
//                     height={barHeight}
//                     width={xScale.bandwidth()}
//                     fill={"red"}
//                 />    
//             </Group>
//             );
//         })}

//         </svg>
//     </div>
//   );
// }



// export default BarGraph
