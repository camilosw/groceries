import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import type { GroceryItem } from '../types';

function makeItem(overrides: Partial<GroceryItem> = {}): GroceryItem {
  return {
    id: 'test-id',
    name: 'Milk',
    purchaseHistory: [],
    purchaseOrder: 0,
    bought: false,
    quantity: 1,
    ...overrides,
  };
}

function backupFile(contents: string, name = 'groceries-2026-08-20.json') {
  return new File([contents], name, { type: 'application/json' });
}

function renderApp(items: GroceryItem[]) {
  localStorage.setItem(
    'groceries-app-state',
    JSON.stringify({ items, sortMode: 'frequency' }),
  );
  return render(<App />);
}

function pickFile(file: File) {
  fireEvent.click(screen.getByLabelText('Menu'));
  fireEvent.click(screen.getByRole('button', { name: 'Import data' }));
  fireEvent.change(screen.getByLabelText('Backup file'), {
    target: { files: [file] },
  });
}

describe('App — import data', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('replaces the list with the contents of a backup file', async () => {
    renderApp([makeItem({ id: '1', name: 'Milk' })]);
    expect(screen.getByText('Milk')).toBeInTheDocument();

    pickFile(
      backupFile(
        JSON.stringify({
          items: [makeItem({ id: '2', name: 'Coffee' })],
          sortMode: 'alphabetical',
        }),
      ),
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Replace' }));

    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.queryByText('Milk')).toBeNull();
    await waitFor(() => {
      const saved = JSON.parse(
        localStorage.getItem('groceries-app-state') ?? '{}',
      );
      expect(saved.items.map((item: GroceryItem) => item.name)).toEqual([
        'Coffee',
      ]);
      expect(saved.sortMode).toBe('alphabetical');
    });
  });

  it('leaves the list untouched when the import is cancelled', async () => {
    renderApp([makeItem({ id: '1', name: 'Milk' })]);

    pickFile(
      backupFile(
        JSON.stringify({ items: [makeItem({ id: '2', name: 'Coffee' })] }),
      ),
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.queryByText('Coffee')).toBeNull();
  });

  it('reports an invalid file and keeps the current list', async () => {
    renderApp([makeItem({ id: '1', name: 'Milk' })]);

    pickFile(backupFile('{"not":"a backup"}', 'notes.json'));

    expect(
      await screen.findByText("This file isn't a valid grocery backup."),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Replace' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByText('Milk')).toBeInTheDocument();
  });
});
