
import React, { Component } from 'react';
import DortGraph from './DotGraph'


class DotGraphWithToolTip extends Component {

    state = {
      tooltipLeft:'',
      tooltipTop:'',
      tooltipData:{x:0.0,y:0.0},
      tooltipOpen:false
    }
  
    showTooltip = ({tooltipLeft,tooltipTop,tooltipData}) => {
      this.setState({
        tooltipLeft :tooltipLeft+290,
        tooltipTop:tooltipTop+10,
        tooltipData,
        tooltipOpen:true
      })
    }
  
    hideTooltip = () => {
      this.setState({
        tooltipOpen:false
      })
    }
  
    render() {
      const {tooltipLeft,tooltipTop,tooltipData, tooltipOpen} = this.state
      const {points,r,fill,stroke,strokeWidth,rectRx,scaleOnX,scaleOnY,width,height} = this.props
      
      return (
        <div className="App">
            
          <DortGraph 
          width={width}
          height={height}
          tooltipLeft={tooltipLeft}
          tooltipTop={tooltipTop}
          tooltipData={tooltipData}
          tooltipOpen={tooltipOpen}
          hideTooltip={this.hideTooltip}
          showTooltip={this.showTooltip}
          points = {points}
          r={r}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth} 
          rectRx={rectRx}
          scaleOnX={scaleOnX}
          scaleOnY={scaleOnY}
          />
           
        </div>
      );
    }
  }
  
  export default DotGraphWithToolTip;
  