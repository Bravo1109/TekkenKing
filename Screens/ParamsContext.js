import React, { createContext, useState } from 'react';

const ParamsContext = createContext();

export const SwipesProvider = ({ children }) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [hasBoostsToTop, setHasBoostsToTop] = useState(0);

  const triggerFunction = () => {
    setIsTriggered(true);
  };

  const resetFunction = () => {
    setIsTriggered(false);
  };

  return (
    <ParamsContext.Provider value={{ 
      isTriggered,
      triggerFunction,
      resetFunction,
      hasBoostsToTop,      
      setHasBoostsToTop }}>
      {children}
    </ParamsContext.Provider>
  );
};

export default ParamsContext;