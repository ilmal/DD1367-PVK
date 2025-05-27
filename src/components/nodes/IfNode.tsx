import React from 'react';
import { Handle, Position } from 'reactflow';

interface IfNodeProps {
  data: {
    label?: string;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}

const IfNode: React.FC<IfNodeProps> = ({ data }) => (
  <div 
    onMouseEnter={data.onMouseEnter} 
    onMouseLeave={data.onMouseLeave} 
    style={{ border: '1px solid #444', borderRadius: '4px', backgroundColor: '#ffcc00', color: '#333', padding: '8px', fontFamily: 'monospace', minWidth: '140px' }}
  >
    <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>If Condition</div>
    <div>{data.label || "if (x > 10)"}</div>
    <Handle type="source" position={Position.Right} id="true" style={{ top: '30%', background: '#555' }} />
    <Handle type="source" position={Position.Right} id="false" style={{ top: '70%', background: '#555' }} />
  </div>
);

export default IfNode;