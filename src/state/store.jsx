/* eslint-disable react/prop-types */
import { useState, useCallback } from "react";
import { createContext, useContextSelector } from "use-context-selector";

const useStore = () => {
  const [items, setItems] = useState([]);

  // I'm aware that not using useCallback here defeats the point of using the library, but it's the only easy way to ensure the
  // state stays reactive
  const addToItems = (newItem) => {
    // Check if item already exists before adding by check if item.name already exists in items
    // setItems((items) => [...items, newItem]);
    let exists = items.some((item) => item.name === newItem.name);
    if (exists) {
      console.log("item already exists");
      setItems((items) => [...items]);
      return;
    }
    setItems((items) => [...items, newItem]);
  };

  const removeAllItems = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    addToItems,
    removeAllItems,
  };
};

const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => (
  <StoreContext.Provider value={useStore()}>{children}</StoreContext.Provider>
);

export const useItems = () =>
  useContextSelector(StoreContext, (store) => store.items);
export const useAddToItems = () =>
  useContextSelector(StoreContext, (store) => store.addToItems);
export const useRemoveAllItems = () =>
  useContextSelector(StoreContext, (store) => store.removeAllItems);
