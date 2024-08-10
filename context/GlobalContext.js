import React, { createContext, useState } from 'react';

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [colors, setColors] = useState({
    primary: '#FBB040',
    secondary: '#00386C'
  });

  return (
    <GlobalContext.Provider value={{ colors, setColors }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
