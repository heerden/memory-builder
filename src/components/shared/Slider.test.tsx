import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Slider } from './Slider';

describe('Slider Component', () => {
  it('should render range input with correct default values and properties', () => {
    const handleChange = vi.fn();
    render(<Slider value={5} min={1} max={10} onChange={handleChange} />);

    const inputElement = screen.getByRole('slider') as HTMLInputElement;
    expect(inputElement).not.toBeNull();
    expect(inputElement.type).toBe('range');
    expect(inputElement.min).toBe('1');
    expect(inputElement.max).toBe('10');
    expect(inputElement.step).toBe('1');
    expect(inputElement.value).toBe('5');
  });

  it('should fire onChange callback when the range input changes value', () => {
    const handleChange = vi.fn();
    render(<Slider value={5} min={1} max={10} step={2} onChange={handleChange} />);

    const inputElement = screen.getByRole('slider') as HTMLInputElement;

    // Change value
    fireEvent.change(inputElement, { target: { value: '7' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(7);
  });
});
