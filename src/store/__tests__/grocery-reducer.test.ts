import { describe, it, expect, vi } from 'vitest';
import { groceryReducer } from '../grocery-reducer';
import type { GroceryState } from '../storage';
import type { GroceryItem } from '../../types';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function makeItem(overrides: Partial<GroceryItem> = {}): GroceryItem {
  return {
    id: 'test-id',
    name: 'Milk',
    purchaseHistory: [],
    purchaseOrder: 0,
    bought: false,
    ...overrides,
  };
}

function makeState(items: GroceryItem[]): GroceryState {
  return { items, sortMode: 'frequency' };
}

describe('CHECK_ITEM', () => {
  it('sets bought to true', () => {
    const state = makeState([makeItem({ id: '1' })]);
    const next = groceryReducer(state, { type: 'CHECK_ITEM', id: '1' });
    expect(next.items[0].bought).toBe(true);
  });

  it('appends a timestamp to purchaseHistory', () => {
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);
    const state = makeState([makeItem({ id: '1' })]);
    const next = groceryReducer(state, { type: 'CHECK_ITEM', id: '1' });
    expect(next.items[0].purchaseHistory).toContain(now);
    vi.restoreAllMocks();
  });

  it('prunes history entries older than 180 days', () => {
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now);
    const old = now - 181 * MS_PER_DAY;
    const state = makeState([makeItem({ id: '1', purchaseHistory: [old] })]);
    const next = groceryReducer(state, { type: 'CHECK_ITEM', id: '1' });
    expect(next.items[0].purchaseHistory).not.toContain(old);
    vi.restoreAllMocks();
  });

  it('does not modify other items', () => {
    const item2 = makeItem({ id: '2', name: 'Eggs' });
    const state = makeState([makeItem({ id: '1' }), item2]);
    const next = groceryReducer(state, { type: 'CHECK_ITEM', id: '1' });
    expect(next.items[1]).toEqual(item2);
  });
});

describe('UNCHECK_ITEM', () => {
  it('sets bought to false', () => {
    const state = makeState([makeItem({ id: '1', bought: true })]);
    const next = groceryReducer(state, { type: 'UNCHECK_ITEM', id: '1' });
    expect(next.items[0].bought).toBe(false);
  });

  it('preserves purchaseOrder', () => {
    const state = makeState([makeItem({ id: '1', bought: true, purchaseOrder: 3 })]);
    const next = groceryReducer(state, { type: 'UNCHECK_ITEM', id: '1' });
    expect(next.items[0].purchaseOrder).toBe(3);
  });

  it('does not modify other items', () => {
    const item2 = makeItem({ id: '2', name: 'Eggs', bought: true });
    const state = makeState([makeItem({ id: '1', bought: true }), item2]);
    const next = groceryReducer(state, { type: 'UNCHECK_ITEM', id: '1' });
    expect(next.items[1]).toEqual(item2);
  });
});
