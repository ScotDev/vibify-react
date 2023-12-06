/* eslint-disable react/prop-types */
import { useState, useCallback } from "react";
import { createContext, useContextSelector } from "use-context-selector";

const useStore = () => {
  const [items, setItems] = useState([]);

  const addToItems = useCallback((newItem) => {
    // Check if item already exists before adding by check if item.name already exists in items
    if (items.filter((item) => item.name === newItem.name).length === 0) {
      setItems((items) => [...items, newItem]);
    }

    // setItems((items) => [...items, newItem]);
  }, []);

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
