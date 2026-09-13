import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { DEFAULT_HARDWARE, detectHardware, type HardwareProfile } from '../services/hardwareDetection';

const HardwareContext = createContext<HardwareProfile & { ready: boolean }>({ ...DEFAULT_HARDWARE, ready: false });
export function HardwareProvider({ children }: { children: ReactNode }) {
  const [hardware, setHardware] = useState({ ...DEFAULT_HARDWARE, ready: false });
  useEffect(() => {
    let active = true;
    void detectHardware().then(profile => { if (active) setHardware({ ...profile, ready: true }); });
    return () => { active = false; };
  }, []);
  return <HardwareContext.Provider value={hardware}>{children}</HardwareContext.Provider>;
}
export const useHardware = () => useContext(HardwareContext);
