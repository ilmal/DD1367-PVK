import React from 'react';
import { render, screen } from '@testing-library/react';
import IfNode from '../IfNode';
import { describe, it, expect } from '@jest/globals';

describe('IfNode', () => {
  it('renders with default label', () => {
    render(<IfNode data={{}} />);
    expect(screen.getByText('If Condition')).toBeInTheDocument();
    expect(screen.getByText('if (x > 10)')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<IfNode data={{ label: 'Custom Condition' }} />);
    expect(screen.getByText('If Condition')).toBeInTheDocument();
    expect(screen.getByText('Custom Condition')).toBeInTheDocument();
  });

  it('has correct styles', () => {
    render(<IfNode data={{}} />);
    const node = screen.getByText('If Condition').parentElement;
    expect(node).toHaveStyle({
      border: '1px solid #444',
      borderRadius: '4px',
      backgroundColor: '#ffcc00',
      color: '#333',
      padding: '8px',
      fontFamily: 'monospace',
      minWidth: '140px',
    });
  });
});