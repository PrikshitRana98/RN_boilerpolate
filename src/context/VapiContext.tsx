import { VAPI_CONFIG } from '@/config/vapi';
import Vapi from '@vapi-ai/react-native';
import React, { createContext, useContext, useEffect, useMemo } from 'react';

const VapiContext = createContext<Vapi | null>(null);

type VapiProviderProps = {
  children: React.ReactNode;
};

export const VapiProvider = ({ children }: VapiProviderProps) => {
  const vapi = useMemo(() => new Vapi(VAPI_CONFIG.API_KEY), []);

  useEffect(() => {
    return () => {
      vapi.stop();
    };
  }, [vapi]);

  return <VapiContext.Provider value={vapi}>{children}</VapiContext.Provider>;
};

export const useVapiClient = () => {
  const vapi = useContext(VapiContext);

  if (!vapi) {
    throw new Error('useVapiClient must be used within VapiProvider');
  }

  return vapi;
};
