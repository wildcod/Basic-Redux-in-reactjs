import React from 'react';
import { Group } from '@vx/group';
import { GlyphCircle,GlyphDot,Dot } from '@vx/glyph';
import { GradientTealBlue } from '@vx/gradient';
import { scaleLinear,scaleBand,scaleTime } from '@vx/scale';
import { withTooltip, Tooltip, TooltipWithBounds } from '@vx/tooltip';
import { localPoint } from '@vx/event';
import {Motion,spring} from 'react-motion'



let tooltipTimeout;



class DotsChart extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      x:()=>{},
      y:()=>{},
      points:this.props.points,
      xScale:()=>{},
      yScale:()=>{},
      scaleOnX:this.props.scaleOnX,
      scaleOnY:this.props.scaleOnY,
      xMax:0,
      yMax:0,
      width: this.props.width,
      height:this.props.height

    }
    // this.handleMouseOver = this.handleMouseOver.bind(this)
  }


  compose = (scale, accessor) => (data) => scale(accessor(data));
 

  decideScaleFunction = (key) => (points,scaleFunc,maxValue) => {
    console.log(maxValue)
      const conf = {
      bandScale: this.bandScale({points,scaleFunc,maxValue}),
      timeScale: this.timeScale({points,scaleFunc,maxValue}),
      linearScale: this.linearScale({points,scaleFunc,maxValue})
    }                                                                                                                                                                                   
    return conf[key]
  }                                                                                             

  bandScale = ({points,scaleFunc,maxValue}) => {
   return  scaleBand({
      rangeRound: [0, maxValue],                                                                      
      domain: points.map(scaleFunc),
      padding: 0.4,
    })
  }

  linearScale = ({points,scaleFunc,maxValue}) => {
  
    return scaleLinear({
      domain: [1.3, 2.2],
      range: [0, maxValue],
      clamp: true
    });
  }

  timeScale = ({points,scaleFunc,maxValue}) => {
   return scaleTime({
        rangeRound : [0,900], 
        domain: [new Date(2012, 4, 23), new Date(2012, 4, 26)],   
    });
  }   
  
  componentDidMount = () => {
    console.log('sahil')
    const { width, height, points, scaleOnX, scaleOnY } = this.state                                 
    console.log(this.state)
    this.updateDataToState({ width, height, points,scaleOnX, scaleOnY})
  }
  componentWillReceiveProps = (nextProps) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    if(this.props.points !== nextProps.points){
      console.log(nextProps)

      const { width, height, points ,scaleOnX,scaleOnY} = nextProps
      this.updateDataToState({ width, height,points,scaleOnX,scaleOnY })
    }
  }

  updateDataToState = ({width, height, points,scaleOnX, scaleOnY}) => {
    const {xMax,yMax,xScale,yScale,x,y} = this.prepareDataForDisplay({width,height,points,scaleOnX,scaleOnY})
    this.setState({xMax,yMax,xScale,yScale,width,height,points,scaleOnX,scaleOnY,x,y})
  }

    


  prepareDataForDisplay = ({width,height,points,scaleOnX,scaleOnY}) => {
     
    const x = d => d[0];
    const y = d => d[1];
    const z = d => d[2];
    const xMax = width;
    const yMax = height-80;
    console.log(xMax , yMax,x,y,points)

    const xScale = this.decideScaleFunction(scaleOnX)(points,x,xMax)
    const yScale = this.decideScaleFunction(scaleOnY)(points,y,yMax)
   console.log(xScale , yScale)
   

    return {xScale,yScale,x,y,xMax,yMax,x,y}

  }

  // xScale = scaleLinear({
  //   domain: [1.3, 2.2],
  //   range: [0, this.props.width],
  //   clamp: true
  // });

  // yScale = scaleLinear({
  //   domain: [0.75, 1.6],
  //   range: [this.props.height-80, 0],
  //   clamp: true
  // });

  handleMouseOver = (point,event) => {
   
    
    const coords = localPoint(event.target.ownerSVGElement, event);
    this.props.showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: {
        x: point[0],
        y:point[1]
      }
    });
  };
  
  render(){
    const {
      tooltipData,
      tooltipLeft,
      tooltipTop,
      tooltipOpen,
      hideTooltip,
    } = this.props
    const {x,y,xScale,yScale,points,width,height,scaleOnX,scaleOnY,xMax,yMax}=this.state
    console.log(xMax,yMax)

   const mydata = points.map((point, i) => {
      return (
          <GlyphDot
            className={"glyph-dots"}
            key={`line-dot-${i}`}
            cx={xScale(x(point))}
            cy={scaleLinear({
              domain: [0.75, 1.6],
              range: [361, 0],
              clamp: true
         })(y(point))}
            r={this.props.r}
            fill={this.props.fill}
            stroke={this.props.stroke}
            strokeWidth={this.props.strokeWidth} 
            onMouseOver={this.handleMouseOver.bind(this,point)} 
            onMouseOut={hideTooltip}
          /> 
      );
    })
    const config = {stiffness :170,damping:10}

    return(
      <Motion defaultStyle={{x:-450 }} style={{x: spring(0,config)}}>
     {value =>  
    <div  style={{transform : `translateX(${value.x}px)`}}>
      <svg width={width} height={height}>
      <GradientTealBlue id="TealBlue" vertical={false} />        
      <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={this.props.rectRx}
          fill={`url(#TealBlue)`}
        />
        <Group
          onTouchStart={() => event => {
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            this.props.hideTooltip();
          }}
        >
          {mydata}
        </Group>
      </svg>
      {tooltipOpen && (
          <TooltipWithBounds
            // set this to random so it correctly updates with parent bounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
            className=''
          >
            <strong>{
              tooltipData.x.toFixed(2) + ', ' +tooltipData.y.toFixed(2)}</strong>
          </TooltipWithBounds>
        )}
    </div>
     }
     </Motion>
    )
  }
}

export default withTooltip(DotsChart)


