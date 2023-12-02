import { createContext, useContext, useState, useEffect } from "react";
import { PropTypes } from "prop-types";

const StoreContext = createContext({});

export const useStore = () => useContext(StoreContext);

const StoreProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToItems = (newItem) => {
    setItems([...items, newItem]);
  };

  const removeAllItems = () => {
    setItems([]);
  };

  const store = {
    items,
    addToItems,
    removeAllItems,
  };

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default StoreProvider;
