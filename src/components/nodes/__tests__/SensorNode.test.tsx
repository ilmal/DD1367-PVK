import React from 'react';
import { render, screen } from '@testing-library/react';
import SensorNode from '../SensorNode';
import { describe, it, expect } from '@jest/globals';

describe('SensorNode', () => {
  it('renders with default label', () => {
    render(<SensorNode data={{}} />);
    expect(screen.getByText('Sensor')).toBeInTheDocument();
    expect(screen.getByText('Temperature Sensor')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<SensorNode data={{ label: 'Custom Sensor' }} />);
    expect(screen.getByText('Sensor')).toBeInTheDocument();
    expect(screen.getByText('Custom Sensor')).toBeInTheDocument();
  });

  it('has correct styles', () => {
    render(<SensorNode data={{}} />);
    const node = screen.getByText('Sensor').parentElement;
    expect(node).toHaveStyle({
      border: '1px solid #444',
      borderRadius: '4px',
      backgroundColor: '#0A0',
      color: 'white',
      padding: '8px',
      fontFamily: 'monospace',
      minWidth: '120px',
    });
  });
});
