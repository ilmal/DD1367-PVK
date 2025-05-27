import React from 'react';
import { Handle, Position } from 'reactflow';

interface SensorNodeProps {
  data: {
    label?: string;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}

const SensorNode: React.FC<SensorNodeProps> = ({ data }) => (
  <div 
    onMouseEnter={data.onMouseEnter} 
    onMouseLeave={data.onMouseLeave} 
    style={{ border: '1px solid #444', borderRadius: '4px', backgroundColor: '#0A0', color: 'white', padding: '8px', fontFamily: 'monospace', minWidth: '120px' }}
  >
    <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Sensor</div>
    <div>{data.label || "Temperature Sensor"}</div>
    <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
  </div>
);

export default SensorNode;