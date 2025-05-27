import React from 'react';
import { Handle, Position } from 'reactflow';

interface OutputNodeProps {
  data: {
    label?: string;
  };
}

const OutputNode: React.FC<OutputNodeProps> = ({ data }) => (
  <div style={{ border: '1px solid #444', borderRadius: '4px', backgroundColor: '#007acc', color: 'white', padding: '8px', fontFamily: 'monospace', minWidth: '120px' }}>
    <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Output</div>
    <div>{data.label || "Display Output"}</div>
    <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
  </div>
);

export default OutputNode;