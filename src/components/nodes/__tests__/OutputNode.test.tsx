import React from 'react';
import { render, screen } from '@testing-library/react';
import OutputNode from '../OutputNode';
import { describe, it, expect } from '@jest/globals';

describe('OutputNode', () => {
  it('renders with default label', () => {
    render(<OutputNode data={{}} />);
    expect(screen.getByText('Output')).toBeInTheDocument();
    expect(screen.getByText('Display Output')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<OutputNode data={{ label: 'Custom Output' }} />);
    expect(screen.getByText('Output')).toBeInTheDocument();
    expect(screen.getByText('Custom Output')).toBeInTheDocument();
  });

  it('has correct styles', () => {
    render(<OutputNode data={{}} />);
    const node = screen.getByText('Output').parentElement;
    expect(node).toHaveStyle({
      border: '1px solid #444',
      borderRadius: '4px',
      backgroundColor: '#007acc',
      color: 'white',
      padding: '8px',
      fontFamily: 'monospace',
      minWidth: '120px',
    });
  });
});