import { create } from "zustand";

const initialState = {
  items: [],
};
const addItem = (items, item) => [
  ...items,
  { id: item.id, name: item.name, type: item.type },
];
// export const useInspirationStore = create((set) => ({
//   ...initialState,
//   items: [],
//   // addToItems: (item) =>
//   //   set((state) => ({
//   //     ...state,
//   //     items: addItem(state.items, item),
//   //   })),
//   addItem: (item, state) =>
//   se()

//   // removeOneItem: (item) =>
//   //   set((state) => ({ items: state.items.filter((i) => i !== item) })),
//   removeAllItems: () => set(initialState),
// }));

const store = (set) => ({
  items: [],
  addToItems: (newItem) =>
    set((store) => ({
      items: [...store.items, newItem],
    })),
  // addToItems: (item) =>
  //   set(() => ({
  //     items: item,
  //   })),
  // removeOneItem: (item) =>
  //   set((state) => ({ items: state.items.filter((i) => i !== item) })),
  removeAllItems: () =>
    set(() => ({
      items: [],
    })),
});

export const useStore = create(store);

// window.store = useInspirationStore;
