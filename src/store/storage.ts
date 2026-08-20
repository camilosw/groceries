import type { GroceryItem, PurchasedSortMode } from '../types';

export interface GroceryState {
  items: GroceryItem[];
  sortMode: PurchasedSortMode;
}

const STORAGE_KEY = 'groceries-app-state';

const SORT_MODES: PurchasedSortMode[] = [
  'frequency',
  'alphabetical',
  'restock',
];

export function saveState(state: GroceryState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore write errors
  }
}

/**
 * Parses and normalizes a serialized GroceryState, from localStorage or from an
 * imported backup file. Returns null when the text is not a grocery backup.
 */
export function parseState(raw: string): GroceryState | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.items)) return null;

    const seen = new Set<string>();
    const items: GroceryItem[] = [];
    for (const [index, entry] of parsed.items.entries()) {
      const item = entry as Partial<GroceryItem>;
      if (typeof item?.id !== 'string' || !item.id) return null;
      if (typeof item?.name !== 'string' || !item.name) return null;
      // Duplicate ids would break React keys and per-id reducer updates.
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      items.push({
        id: item.id,
        name: item.name,
        purchaseHistory: Array.isArray(item.purchaseHistory)
          ? item.purchaseHistory.filter(
              (ts: unknown): ts is number =>
                typeof ts === 'number' && Number.isFinite(ts),
            )
          : [],
        purchaseOrder:
          typeof item.purchaseOrder === 'number' &&
          Number.isFinite(item.purchaseOrder)
            ? item.purchaseOrder
            : index,
        bought: Boolean(item.bought),
        quantity:
          typeof item.quantity === 'number' && Number.isFinite(item.quantity)
            ? Math.max(1, item.quantity)
            : 1,
      });
    }

    const sortMode: PurchasedSortMode = SORT_MODES.includes(parsed.sortMode)
      ? parsed.sortMode
      : 'restock';

    return { items, sortMode };
  } catch {
    return null;
  }
}

export function loadState(): GroceryState | null {
  return parseState(localStorage.getItem(STORAGE_KEY) ?? '');
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
      purchaseHistory: [daysAgo(18), daysAgo(11), daysAgo(4)],
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
      purchaseHistory: [daysAgo(20), daysAgo(15), daysAgo(10)],
      purchaseOrder: 2,
      bought: true,
      quantity: 1,
    },
    {
      id: crypto.randomUUID(),
      name: 'Cheese',
      purchaseHistory: [daysAgo(13), daysAgo(9), daysAgo(3)],
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

  return { items, sortMode: 'restock' };
}
