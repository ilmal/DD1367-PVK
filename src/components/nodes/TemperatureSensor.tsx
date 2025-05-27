import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

interface TemperatureSensorProps {
  data: {
    rawData?: {
      type: string;
      properties: any;
    };
    unit?: 'Celsius' | 'Kelvin';
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}

const TemperatureSensor: React.FC<TemperatureSensorProps> = ({ data }) => {
  const [unit, setUnit] = useState<'Celsius' | 'Kelvin'>(data.unit || 'Celsius');
  const rawData = data.rawData || { type: '', properties: {} };
  const showClk = ['SPI Main', 'SPI Sub', 'I2C', 'UART', 'CAN'].includes(rawData.type);

  return (
    <div
      onMouseEnter={data.onMouseEnter}
      onMouseLeave={data.onMouseLeave}
      style={{
        backgroundColor: '#fee2e2', // Light red background
        padding: '12px',
        fontFamily: 'sans-serif',
        minWidth: '140px',
        position: 'relative',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <div
        style={{
          fontWeight: 'bold',
          fontSize: '14px',
          textAlign: 'center',
          marginBottom: '12px',
          color: '#b91c1c', // Darker red for title
        }}
      >
        Temperature Sensor
      </div>
      <div
        style={{
          display: 'grid',
          gap: '8px',
          fontSize: '12px',
          color: '#333',
        }}
      >
        <div>
          <span style={{ fontWeight: 500 }}>Input: </span>
          {rawData.type || 'No Config'}
        </div>
        <div>
          <span style={{ fontWeight: 500 }}>Unit: </span>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'Celsius' | 'Kelvin')}
            style={{
              width: '100%',
              padding: '4px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px',
              appearance: 'auto',
              backgroundColor: '#fff',
            }}
          >
            <option value="Celsius">Celsius</option>
            <option value="Kelvin">Kelvin</option>
          </select>
        </div>
        <div>
          <span style={{ fontWeight: 500 }}>Output: </span>
          Temperature ({unit})
        </div>
      </div>
      {showClk && (
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '4px',
            fontSize: '10px',
            backgroundColor: '#b91c1c', // Dark red badge
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '8px',
            fontWeight: 500
          }}
        >
          CLK
        </div>
      )}
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
    </div>
  );
};

export default TemperatureSensor;