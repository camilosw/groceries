import { describe, it, expect, beforeEach } from 'vitest';
import { saveState, loadState, parseState, seedData } from '../storage';
import type { GroceryState } from '../storage';

const mockState: GroceryState = {
  items: [
    {
      id: '1',
      name: 'Milk',
      purchaseHistory: [],
      purchaseOrder: 0,
      bought: false,
      quantity: 1,
    },
  ],
  sortMode: 'frequency',
};

describe('saveState / loadState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads state roundtrip', () => {
    saveState(mockState);
    expect(loadState()).toEqual(mockState);
  });

  it('returns null when nothing is saved', () => {
    expect(loadState()).toBeNull();
  });

  it('returns null for corrupt data', () => {
    localStorage.setItem('groceries-app-state', 'not-json{{{');
    expect(loadState()).toBeNull();
  });

  it('returns null when items is not an array', () => {
    localStorage.setItem(
      'groceries-app-state',
      JSON.stringify({ items: 'bad', sortMode: 'frequency' }),
    );
    expect(loadState()).toBeNull();
  });

  it('defaults quantity to 1 for items missing the field', () => {
    const oldItem = {
      id: '1',
      name: 'Milk',
      purchaseHistory: [],
      purchaseOrder: 0,
      bought: false,
    };
    localStorage.setItem(
      'groceries-app-state',
      JSON.stringify({ items: [oldItem], sortMode: 'frequency' }),
    );
    const loaded = loadState();
    expect(loaded?.items[0].quantity).toBe(1);
  });
});

describe('parseState', () => {
  it('parses a serialized backup', () => {
    expect(parseState(JSON.stringify(mockState))).toEqual(mockState);
  });

  it('returns null for malformed JSON', () => {
    expect(parseState('not-json{{{')).toBeNull();
  });

  it('returns null when items is not an array', () => {
    expect(parseState(JSON.stringify({ items: 'bad' }))).toBeNull();
  });

  it('returns null when an item is missing id or name', () => {
    expect(
      parseState(JSON.stringify({ items: [{ name: 'Milk' }] })),
    ).toBeNull();
    expect(parseState(JSON.stringify({ items: [{ id: '1' }] }))).toBeNull();
  });

  it('defaults quantity to 1 and purchaseOrder to the item index', () => {
    const parsed = parseState(
      JSON.stringify({ items: [{ id: '1', name: 'Milk' }] }),
    );
    expect(parsed?.items[0].quantity).toBe(1);
    expect(parsed?.items[0].purchaseOrder).toBe(0);
    expect(parsed?.items[0].purchaseHistory).toEqual([]);
    expect(parsed?.items[0].bought).toBe(false);
  });

  it('raises quantities below 1 to 1', () => {
    const parsed = parseState(
      JSON.stringify({ items: [{ id: '1', name: 'Milk', quantity: 0 }] }),
    );
    expect(parsed?.items[0].quantity).toBe(1);
  });

  it('falls back to restock for an unknown sortMode', () => {
    const parsed = parseState(
      JSON.stringify({ items: [], sortMode: 'nonsense' }),
    );
    expect(parsed?.sortMode).toBe('restock');
  });

  it('drops items whose id duplicates an earlier one', () => {
    const parsed = parseState(
      JSON.stringify({
        items: [
          { id: '1', name: 'Milk' },
          { id: '1', name: 'Milk copy' },
          { id: '2', name: 'Eggs' },
        ],
      }),
    );
    expect(parsed?.items.map((item) => item.name)).toEqual(['Milk', 'Eggs']);
  });

  it('filters non-numeric purchaseHistory entries', () => {
    const parsed = parseState(
      JSON.stringify({
        items: [{ id: '1', name: 'Milk', purchaseHistory: [1000, 'x', null] }],
      }),
    );
    expect(parsed?.items[0].purchaseHistory).toEqual([1000]);
  });
});

describe('seedData', () => {
  it('returns a non-empty state with a valid sortMode', () => {
    const state = seedData();
    expect(state.items.length).toBeGreaterThan(0);
    expect(state.sortMode).toBe('restock');
  });

  it('returns items conforming to the GroceryItem shape', () => {
    const state = seedData();
    for (const item of state.items) {
      expect(typeof item.id).toBe('string');
      expect(item.id.length).toBeGreaterThan(0);
      expect(typeof item.name).toBe('string');
      expect(Array.isArray(item.purchaseHistory)).toBe(true);
      expect(typeof item.purchaseOrder).toBe('number');
      expect(typeof item.bought).toBe('boolean');
      expect(item.quantity).toBeGreaterThanOrEqual(1);
    }
  });

  it('has unique ids and purchaseOrder values', () => {
    const state = seedData();
    const ids = state.items.map((item) => item.id);
    const orders = state.items.map((item) => item.purchaseOrder);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it('includes both to-buy and purchased items', () => {
    const state = seedData();
    expect(state.items.some((item) => item.bought)).toBe(true);
    expect(state.items.some((item) => !item.bought)).toBe(true);
  });

  it('includes purchased items with 0, 1, and 2+ history entries', () => {
    const state = seedData();
    const historyLengths = state.items
      .filter((item) => item.bought)
      .map((item) => item.purchaseHistory.length);
    expect(historyLengths).toContain(1);
    expect(historyLengths.some((n) => n >= 2)).toBe(true);
  });
});
