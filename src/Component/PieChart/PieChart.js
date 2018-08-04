import React from 'react';
import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import { GradientPinkBlue } from '@vx/gradient';
import {Motion,spring} from 'react-motion'


function Label({ x, y, children,fillLabel,LabeltextAnchor,dy }) {
  return (
    <text
    fill={fillLabel}
    textAnchor={LabeltextAnchor}
      x={x}
      y={y}
      dy={dy}
      fontSize={9}
    >
      {children}
    </text>
  );
}

const PieChart =  ({width,height,browsers,events, margin,fillColor ,fillLabel ,LabeltextAnchor,dy,isPieSolid,innerPieRadius}) => {
 
 
  if (width < 10) return null;

  const radius = Math.min(width, height) / 2;
  const config = {stiffness :170,damping:10}
  return (

    <Motion defaultStyle={{x:-450 }} style={{x: spring(0,config)}}>
    {value => 
      <div className='' style={{transform : `translateX(${value.x}px)`}} >
     <svg width={width} height={height}>
      <GradientPinkBlue id="gradients" />
      <rect
        x={0}
        y={0}
        rx={14}
        width={width}
        height={height}
        fill="url('#gradients')"
      />
      <Group top={height / 2 - margin.top} left={width / 2}>
      <Pie
            data={browsers}
            pieValue={d => d.usage}
             outerRadius={radius - 40}
            //  innerRadius={radius-150}
            innerRadius={isPieSolid? 0 : radius-innerPieRadius }
            fill={fillColor}
            fillOpacity={d => 1 / (d.index + 2) }
            cornerRadius={3}
            padAngle={0}
            centroid={(centroid, arc) => {
                console.log(centroid)
                const [x, y] = centroid;
                const { startAngle, endAngle } = arc;
                if (endAngle - startAngle < .1) return null;
                console.log(x,y)
                return <Label x={x} y={y} fillLabel={fillLabel} dy={dy} LabeltextAnchor={LabeltextAnchor} >{arc.data.label}</Label>;
            }}
            />
       
      </Group>
    </svg>
    </div>
    }
    </Motion>
  );
}

export default PieChart


