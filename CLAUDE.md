# Grocery List App — Project State

## Current phase: Phase 3 complete (Main screen — To Buy list)

## Stack
- React 19 + TypeScript + Vite
- @dnd-kit/core + @dnd-kit/sortable (drag-and-drop with touch support)
- Vitest + @testing-library/react + jsdom (unit/component tests)
- Google Fonts: Caveat (handwritten) + Nunito (UI)

## Key decisions (from PLAN.md)
- Purchase history: timestamp array, exponential decay frequency scoring
- Purchase interval displayed as `c/Nd` (median gap, shown when ≥2 purchases)
- Add button is a FAB, not inline add-bar
- Reordering on dedicated Order screen (not inline)
- UI language: English

## File structure so far
```
src/
  main.tsx          -- Entry point
  App.tsx           -- GroceryProvider + Header + MainScreen
  App.css           -- Global styles: CSS vars, reset, .app container, notebook effect
  index.css         -- Minimal body reset
  types.ts          -- GroceryItem interface, PurchasedSortMode type
  test-setup.ts     -- @testing-library/jest-dom import for Vitest
  utils/
    frequency.ts                -- frequencyScore(), purchaseInterval(), pruneHistory()
    __tests__/
      frequency.test.ts         -- 16 tests (all passing)
  store/
    storage.ts                  -- GroceryState type, saveState(), loadState(), seedData()
    grocery-reducer.ts          -- groceryReducer + GroceryAction type (CHECK_ITEM, UNCHECK_ITEM stubs for rest)
    grocery-context.tsx         -- GroceryProvider, useGroceries hook
    __tests__/
      grocery-reducer.test.ts   -- 7 tests (all passing)
      storage.test.ts           -- 6 tests (all passing)
  components/
    Header.tsx / Header.css     -- Sticky orange header
    SectionHeader.tsx           -- "To Buy (N)" divider
    BuyItem.tsx                 -- Unchecked item (checkbox + name + c/Nd badge)
    BuyList.tsx                 -- Sorted to-buy list + empty state
  screens/
    MainScreen.tsx / MainScreen.css  -- To Buy section (purchased section coming in Phase 4)
    __tests__/
      MainScreen.test.tsx       -- 5 tests (all passing)
```

## What's next: Phase 4
- Purchased list: DELETE_ITEM, SET_SORT_MODE actions
- Components: PurchasedItem, PurchasedList
- Add purchased section to MainScreen
- Seed data should include already-purchased items

## Running
- `pnpm dev` — dev server (shows To Buy list with seed data)
- `pnpm test` — run all tests with Vitest (35 passing)
- `pnpm build` — production build
