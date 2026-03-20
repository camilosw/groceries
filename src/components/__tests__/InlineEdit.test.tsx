import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InlineEdit } from '../InlineEdit';

function renderInlineEdit(onSave = vi.fn()) {
  return {
    onSave,
    ...render(
      <InlineEdit value="Milk" onSave={onSave} ariaLabel="Edit name" />,
    ),
  };
}

describe('InlineEdit', () => {
  it('renders item name as a span in display mode', () => {
    renderInlineEdit();
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('clicking the span switches to an input with the current value', () => {
    renderInlineEdit();
    fireEvent.click(screen.getByText('Milk'));
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe('Milk');
  });

  it('pressing Enter calls onSave with trimmed value and exits edit mode', () => {
    const { onSave } = renderInlineEdit();
    fireEvent.click(screen.getByText('Milk'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: ' Oat Milk ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSave).toHaveBeenCalledWith('Oat Milk');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('pressing Escape exits edit mode without calling onSave', () => {
    const { onSave } = renderInlineEdit();
    fireEvent.click(screen.getByText('Milk'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Something else' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('blur calls onSave and exits edit mode', () => {
    const { onSave } = renderInlineEdit();
    fireEvent.click(screen.getByText('Milk'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Oat Milk' } });
    fireEvent.blur(input);
    expect(onSave).toHaveBeenCalledWith('Oat Milk');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
