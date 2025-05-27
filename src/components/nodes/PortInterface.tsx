import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

interface PortInterfaceProps {
  data: {
    gpio3v3?: CommConfig;
    gpio1v8?: CommConfig;
    lvds?: number[];
  };
}

interface CommConfig {
  type: 'SPI Main' | 'SPI Sub' | 'I2C' | 'UART' | 'CAN' | '';
  properties?: any;
}

const PortInterface: React.FC<PortInterfaceProps> = ({ data }) => {
  const [gpio3v3, setGpio3v3] = useState<CommConfig>(data.gpio3v3 || { type: '' });
  const [gpio1v8, setGpio1v8] = useState<CommConfig>(data.gpio1v8 || { type: '' });
  const [lvds, setLvds] = useState<number[]>(data.lvds || []);
  const [newLvds, setNewLvds] = useState<string>('');

  const commTypes = ['SPI Main', 'SPI Sub', 'I2C', 'UART', 'CAN'];

  const handleCommChange = (
    section: 'gpio3v3' | 'gpio1v8',
    type: string
  ) => {
    const config: CommConfig = { type: type as any, properties: {} };
    if (type === 'SPI Main' || type === 'SPI Sub') {
      config.properties = {
        mode: 'full duplex',
        dataSpeed: '',
        dataLength: '',
        dataOrder: 'LSB',
        clockParity: '',
        clockPhase: '',
      };
    } else if (type === 'I2C') {
      config.properties = {
        dataSpeed: 'standard',
        address: '',
        direction: 'transmit',
      };
    } else if (type === 'UART') {
      config.properties = {
        baudRate: '',
        startBit: '',
        stopBits: '',
        parityBits: '',
        dataBits: '',
        direction: 'transmit',
      };
    } else if (type === 'CAN') {
      config.properties = {
        baudRate: 'fault-tolerant',
        messageId: '',
      };
    }
    if (section === 'gpio3v3') {
      setGpio3v3(config);
    } else {
      setGpio1v8(config);
    }
  };

  const handlePropertyChange = (
    section: 'gpio3v3' | 'gpio1v8',
    prop: string,
    value: string
  ) => {
    const setConfig = section === 'gpio3v3' ? setGpio3v3 : setGpio1v8;
    setConfig((prev) => ({
      ...prev,
      properties: { ...prev.properties, [prop]: value },
    }));
  };

  const handleAddLvds = () => {
    const num = parseInt(newLvds);
    if (isNaN(num) || num < 0 || num > 16) return;
    const currentSum = lvds.reduce((sum, n) => sum + n, 0);
    if (currentSum + num > 16) {
      window.alert('Maximum LVDS sum of 16 exceeded!');
      return;
    }
    setLvds([...lvds, num]);
    setNewLvds('');
  };

  const renderCommSection = (section: 'gpio3v3' | 'gpio1v8', config: CommConfig) => {
    const setConfig = section === 'gpio3v3' ? setGpio3v3 : setGpio1v8;
    return (
      <div style={{ marginBottom: '12px' }}>
        <h4 style={{ fontSize: '12px', marginBottom: '4px' }}>
          {section === 'gpio3v3' ? 'GPIO 3.3V' : 'GPIO 1.8V'}
        </h4>
        <select
          style={{
            width: '100%',
            padding: '4px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '12px',
            appearance: 'auto',
          }}
          value={config.type}
          onChange={(e) => handleCommChange(section, e.target.value)}
        >
          <option value="">Choose option</option>
          {commTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {config.type && renderProperties(section, config)}
      </div>
    );
  };

  const renderProperties = (section: 'gpio3v3' | 'gpio1v8', config: CommConfig) => {
    if (config.type === 'SPI Main' || config.type === 'SPI Sub') {
      return (
        <div style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            {['Full-Duplex', 'Half-Duplex', 'Receive Only', 'Transmit Only'].map((mode) => (
              <label key={mode} style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                <input
                  type="radio"
                  name={`${section}-mode`}
                  value={mode.toLowerCase().replace(' ', ' ')}
                  checked={config.properties.mode === mode.toLowerCase().replace(' ', ' ')}
                  onChange={(e) => handlePropertyChange(section, 'mode', e.target.value)}
                  style={{ marginRight: '4px' }}
                />
                {mode}
              </label>
            ))}
          </div>
          <div style={{ display: 'grid', gap: '4px' }}>
            <label style={{ fontSize: '12px' }}>
              Data Speed
              <input
                type="text"
                placeholder="Type here"
                value={config.properties.dataSpeed}
                onChange={(e) => handlePropertyChange(section, 'dataSpeed', e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              />
            </label>
            <label style={{ fontSize: '12px' }}>
              Data Length
              <input
                type="text"
                placeholder="Type here"
                value={config.properties.dataLength}
                onChange={(e) => handlePropertyChange(section, 'dataLength', e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              />
            </label>
            <label style={{ fontSize: '12px' }}>
              Data Order
              <select
                value={config.properties.dataOrder}
                onChange={(e) => handlePropertyChange(section, 'dataOrder', e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '12px',
                  appearance: 'auto',
                }}
              >
                <option value="LSB">LSB</option>
                <option value="MSB">MSB</option>
              </select>
            </label>
            <label style={{ fontSize: '12px' }}>
              Clock Polarity
              <input
                type="text"
                placeholder="Type here"
                value={config.properties.clockParity}
                onChange={(e) => handlePropertyChange(section, 'clockParity', e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              />
            </label>
            <label style={{ fontSize: '12px' }}>
              Clock Phase
              <input
                type="text"
                placeholder="Type here"
                value={config.properties.clockPhase}
                onChange={(e) => handlePropertyChange(section, 'clockPhase', e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              />
            </label>
          </div>
        </div>
      );
    } else if (config.type === 'I2C') {
      return (
        <div style={{ marginTop: '8px', display: 'grid', gap: '4px' }}>
          <label style={{ fontSize: '12px' }}>
            Data Speed
            <select
              value={config.properties.dataSpeed}
              onChange={(e) => handlePropertyChange(section, 'dataSpeed', e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
                appearance: 'auto',
              }}
            >
              <option value="standard">Standard</option>
              <option value="fast">Fast</option>
              <option value="high-speed">High-Speed</option>
              <option value="ultra-fast">Ultra-Fast</option>
            </select>
          </label>
          <label style={{ fontSize: '12px' }}>
            Address
            <input
              type="text"
              placeholder="Type here"
              value={config.properties.address}
              onChange={(e) => handlePropertyChange(section, 'address', e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
          </label>
          <label style={{ fontSize: '12px' }}>
            Direction
            <select
              value={config.properties.direction}
              onChange={(e) => handlePropertyChange(section, 'direction', e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
                appearance: 'auto',
              }}
            >
              <option value="transmit">Transmit</option>
              <option value="receive">Receive</option>
            </select>
          </label>
        </div>
      );
    } else if (config.type === 'UART') {
      return (
        <div style={{ marginTop: '8px', display: 'grid', gap: '4px' }}>
          <label style={{ fontSize: '12px' }}>
            Baud Rate
            <input
              type="text"
              placeholder="Type here"
              value={config.properties.baudRate}
              onChange={(e) => handlePropertyChange(section, 'baudRate', e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
          </label>
          <label style={{ fontSize: '12px' }}>
            Start Bit
            <input
              type="text"
              placeholder="Type here"
              value={config.properties.startBit}
              onChange={(e) => handlePropertyChange(section, 'startBit', e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
          </label>
          <label style={{ fontSize: '12px' }}>
            Stop Bits
            <input
              type="text"
              placeholder="Type here"
              value={config.properties.stopBits}
              onChange={(e) => handlePropertyChange(section, 'stopBits', e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
          </label>
          <label style={{ fontSize: '12px' }}>
            Parity Bits
            <input
              type="text"
              placeholder="Type here"
              value={config.properties.parityBits}
              onChange={(e) => handlePropertyChange(section, 'parityBits', e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
          </label>
          <label style={{ fontSize: '12px' }}>
            Data Bits
            <input
              type="text"
              placeholder="Type here"
              value={config.properties.dataBits}
              onChange={(e) => handlePropertyChange(section, 'dataBits', e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
          </label>
          <label style={{ fontSize: '12px' }}>
            Direction
            <select
              value={config.properties.direction}
              onChange={(e) => handlePropertyChange(section, 'direction', e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
                appearance: 'auto',
              }}
            >
              <option value="transmit">Transmit (TX)</option>
              <option value="receive">Receive (RX)</option>
            </select>
          </label>
        </div>
      );
    } else if (config.type === 'CAN') {
      return (
        <div style={{ marginTop: '8px', display: 'grid', gap: '4px' }}>
          <label style={{ fontSize: '12px' }}>
            Baud Rate
            <select
              value={config.properties.baudRate}
              onChange={(e) => handlePropertyChange(section, 'baudRate', e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
                appearance: 'auto',
              }}
            >
              <option value="fault-tolerant">Fault-Tolerant</option>
              <option value="classical 2.0">Classical 2.0</option>
              <option value="CANFD">CANFD</option>
              <option value="CANXL">CANXL</option>
            </select>
          </label>
          <label style={{ fontSize: '12px' }}>
            Message ID
            <input
              type="text"
              placeholder="Type here"
              value={config.properties.messageId}
              onChange={(e) => handlePropertyChange(section, 'messageId', e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
          </label>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ backgroundColor: '#f5f5f7', padding: '12px', fontFamily: 'sans-serif', minWidth: '200px', position: 'relative', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <div style={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'center', marginBottom: '12px', color: '#333' }}>
        Port Interface
      </div>
      {renderCommSection('gpio3v3', gpio3v3)}
      {renderCommSection('gpio1v8', gpio1v8)}
      <div>
        <h4 style={{ fontSize: '12px', marginBottom: '4px' }}>
          LVDS
          <span style={{ fontSize: '10px', color: '#666', marginLeft: '4px' }}>(max 16)</span>
        </h4>
        <div style={{ display: 'flex', gap: '4px' }}>
          <input
            type="number"
            min="0"
            max="16"
            placeholder="Number"
            value={newLvds}
            onChange={(e) => setNewLvds(e.target.value)}
            style={{
              width: '100%',
              padding: '4px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px',
              backgroundColor: '#fff',
            }}
          />
          <button
            onClick={handleAddLvds}
            style={{
              padding: '4px 8px',
              backgroundColor: '#e0e0e0',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            +
          </button>
        </div>
        {lvds.length > 0 && (
          <div style={{ fontSize: '12px', marginTop: '4px' }}>
            Values: {lvds.join(', ')} (Sum: {lvds.reduce((sum, n) => sum + n, 0)})
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
    </div>
  );
};

export default PortInterface;