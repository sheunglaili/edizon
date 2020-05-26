import React from "react";
import Bumblebee from 'bumblebee-hotword';

const ContextStore = React.createContext({
  bumblebee: null,
});

interface Props {
  bumblebee: Bumblebee;
  children: React.ReactNode;
}

export default function BumbleBeeProvider({ bumblebee, children }: Props) {
  return (
    <ContextStore.Provider value={{ bumblebee }}>
      {children}
    </ContextStore.Provider>
  );
}

export const useBumbleBee = () => {
    const value = React.useContext(ContextStore);
    
    return value
}
