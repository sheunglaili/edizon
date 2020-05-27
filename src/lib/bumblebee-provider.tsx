import React from "react";
import Bumblebee from 'bumblebee-hotword';

interface BumblebeeContext {
  bumblebee : null | Bumblebee
}

const ContextStore = React.createContext<BumblebeeContext>({
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
