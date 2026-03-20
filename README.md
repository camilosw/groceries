# Grocery List

A mobile-first grocery list PWA built with React 19 and TypeScript.

## Features

- **To Buy / Purchased** — check off items as you shop; purchased items move to a collapsible section
- **Smart frequency badges** — items display a `c/Nd` badge (e.g. `c/7d`) showing your median purchase interval once you've bought an item at least twice
- **Add screen** — search your purchase history and add items back with one tap; new items are created inline
- **Reorder screen** — drag-and-drop (mouse and touch) to set a custom shopping order
- **Sort purchased items** — toggle between frequency-based and alphabetical sorting
- **Persistent** — state is saved to `localStorage` automatically
- **PWA** — installable on mobile; works offline

## Stack

| Layer         | Library                            |
| ------------- | ---------------------------------- |
| UI            | React 19 + TypeScript              |
| Build         | Vite                               |
| Drag-and-drop | @dnd-kit/core + @dnd-kit/sortable  |
| Tests         | Vitest + @testing-library/react    |
| Fonts         | Caveat (handwritten) + Nunito (UI) |

## Getting started

```bash
pnpm install
pnpm dev       # development server at http://localhost:5173
pnpm test      # run all tests (64 passing)
pnpm build     # production build
pnpm preview   # preview production build locally
```

## Project structure

```
src/
  App.tsx                   # Provider + header + screen router
  types.ts                  # GroceryItem interface, shared types
  utils/
    frequency.ts            # frequencyScore(), purchaseInterval(), pruneHistory()
  store/
    storage.ts              # loadState() / saveState() (localStorage)
    grocery-reducer.ts      # Pure reducer + all action types
    grocery-context.tsx     # GroceryProvider + useGroceries hook
  components/
    BuyItem / BuyList       # To-buy section
    PurchasedItem / PurchasedList  # Purchased section with sort toggle
    AddItemRow              # Row in the add screen
    Header                  # Sticky header with ⋮ menu
    Fab                     # Floating "+" button
  screens/
    MainScreen              # Main list view
    AddScreen               # Search + add items
    OrderScreen             # Drag-and-drop reorder
```
