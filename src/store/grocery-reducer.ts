import type { PurchasedSortMode } from '../types';
import type { GroceryState } from './storage';
import { pruneHistory } from '../utils/frequency';

export type GroceryAction =
  | { type: 'CHECK_ITEM'; id: string }
  | { type: 'UNCHECK_ITEM'; id: string }
  | { type: 'DELETE_ITEM'; id: string }
  | { type: 'SET_SORT_MODE'; mode: PurchasedSortMode }
  | { type: 'CREATE_AND_ADD'; name: string }
  | { type: 'ADD_TO_BUY'; id: string }
  | { type: 'REORDER'; activeId: string; overId: string };

export function groceryReducer(state: GroceryState, action: GroceryAction): GroceryState {
  switch (action.type) {
    case 'CHECK_ITEM': {
      const now = Date.now();
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.id
            ? {
                ...item,
                bought: true,
                purchaseHistory: pruneHistory([...item.purchaseHistory, now]),
              }
            : item
        ),
      };
    }
    case 'UNCHECK_ITEM': {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.id ? { ...item, bought: false } : item
        ),
      };
    }
    default:
      return state;
  }
}
