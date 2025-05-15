import { useContext } from 'react';
import { DesktopContext } from '@/components/os/Desktop';

export const useDesktop = () => {
  const context = useContext(DesktopContext);
  
  if (!context) {
    throw new Error('useDesktop must be used within a Desktop provider');
  }
  
  return context;
}; 