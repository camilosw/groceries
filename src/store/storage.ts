import type { GroceryItem, PurchasedSortMode } from '../types';

export interface GroceryState {
  items: GroceryItem[];
  sortMode: PurchasedSortMode;
}

const STORAGE_KEY = 'groceries-app-state';

export function saveState(state: GroceryState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore write errors
  }
}

export function loadState(): GroceryState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.items)) return null;
    const items: GroceryItem[] = parsed.items.map((item: GroceryItem) => ({
      ...item,
      quantity: item.quantity ?? 1,
    }));
    return { ...parsed, items } as GroceryState;
  } catch {
    return null;
  }
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Mock state for local development only — never called in production builds. */
export function seedData(): GroceryState {
  const now = Date.now();
  const daysAgo = (n: number) => now - n * MS_PER_DAY;

  const items: GroceryItem[] = [
    {
      id: crypto.randomUUID(),
      name: 'Milk',
      purchaseHistory: [daysAgo(12), daysAgo(8), daysAgo(4)],
      purchaseOrder: 0,
      bought: true,
      quantity: 1,
    },
    {
      id: crypto.randomUUID(),
      name: 'Eggs',
      purchaseHistory: [daysAgo(21), daysAgo(14), daysAgo(7)],
      purchaseOrder: 1,
      bought: true,
      quantity: 2,
    },
    {
      id: crypto.randomUUID(),
      name: 'Bread',
      purchaseHistory: [daysAgo(15), daysAgo(10), daysAgo(5)],
      purchaseOrder: 2,
      bought: true,
      quantity: 1,
    },
    {
      id: crypto.randomUUID(),
      name: 'Cheese',
      purchaseHistory: [daysAgo(9), daysAgo(5), daysAgo(2)],
      purchaseOrder: 3,
      bought: true,
      quantity: 1,
    },
    {
      id: crypto.randomUUID(),
      name: 'Rice',
      purchaseHistory: [daysAgo(10)],
      purchaseOrder: 4,
      bought: true,
      quantity: 1,
    },
    {
      id: crypto.randomUUID(),
      name: 'Coffee',
      purchaseHistory: [daysAgo(65), daysAgo(30)],
      purchaseOrder: 5,
      bought: true,
      quantity: 1,
    },
    {
      id: crypto.randomUUID(),
      name: 'Bananas',
      purchaseHistory: [],
      purchaseOrder: 6,
      bought: false,
      quantity: 3,
    },
    {
      id: crypto.randomUUID(),
      name: 'Chicken Breast',
      purchaseHistory: [],
      purchaseOrder: 7,
      bought: false,
      quantity: 2,
    },
    {
      id: crypto.randomUUID(),
      name: 'Paper Towels',
      purchaseHistory: [],
      purchaseOrder: 8,
      bought: false,
      quantity: 1,
    },
    {
      id: crypto.randomUUID(),
      name: 'Dish Soap',
      purchaseHistory: [],
      purchaseOrder: 9,
      bought: false,
      quantity: 1,
    },
  ];

  return { items, sortMode: 'frequency' };
}
