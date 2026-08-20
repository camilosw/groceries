import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImportModal } from '../ImportModal';
import type { GroceryState } from '../../store/storage';

const importedState: GroceryState = {
  items: [
    {
      id: '1',
      name: 'Milk',
      purchaseHistory: [],
      purchaseOrder: 0,
      bought: false,
      quantity: 1,
    },
    {
      id: '2',
      name: 'Coffee',
      purchaseHistory: [],
      purchaseOrder: 1,
      bought: true,
      quantity: 1,
    },
  ],
  sortMode: 'restock',
};

function renderModal(state: GroceryState | null, props = {}) {
  const onCancel = vi.fn();
  const onConfirm = vi.fn();
  render(
    <ImportModal
      fileName="groceries-2026-08-20.json"
      state={state}
      onCancel={onCancel}
      onConfirm={onConfirm}
      {...props}
    />,
  );
  return { onCancel, onConfirm };
}

describe('ImportModal', () => {
  it('shows the file name and a summary of its contents', () => {
    renderModal(importedState);
    expect(screen.getByText('groceries-2026-08-20.json')).toBeInTheDocument();
    expect(screen.getByText('2 items · 1 to buy')).toBeInTheDocument();
    expect(
      screen.getByText('This replaces your current list.'),
    ).toBeInTheDocument();
  });

  it('calls onConfirm with the parsed state when Replace is clicked', () => {
    const { onConfirm } = renderModal(importedState);
    fireEvent.click(screen.getByRole('button', { name: 'Replace' }));
    expect(onConfirm).toHaveBeenCalledWith(importedState);
  });

  it('calls onCancel when Cancel is clicked', () => {
    const { onCancel, onConfirm } = renderModal(importedState);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('calls onCancel when Escape is pressed', () => {
    const { onCancel } = renderModal(importedState);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalled();
  });

  it('shows an error and no Replace button for an unreadable file', () => {
    renderModal(null);
    expect(
      screen.getByText("This file isn't a valid grocery backup."),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Replace' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});
