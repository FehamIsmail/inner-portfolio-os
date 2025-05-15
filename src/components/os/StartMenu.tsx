import React, { useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import Icon from '@/components/common/Icon';
import { APPLICATIONS } from '@/constants/data';
import { useDesktop } from '@/hooks/useDesktop';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeOption {
  name: string;
  value: string;
  background: string;
}

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEMES: ThemeOption[] = [
  { name: 'Default', value: '#ba8752', background: 'bg-[#ba8752]' },
  { name: 'Clear', value: '#6bb5d3', background: 'bg-[#6bb5d3]' },
  { name: 'Night', value: '#2c3e50', background: 'bg-[#2c3e50]' },
  { name: 'Dracula', value: '#282a36', background: 'bg-[#282a36]' },
];

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
  const { onOpen } = useDesktop();
  
  const setTheme = useCallback((backgroundColor: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Setting theme to:', backgroundColor);
    document.documentElement.style.setProperty('--color-retro-background', backgroundColor);
    const event = new Event('themeChanged');
    document.dispatchEvent(event);
    onClose();
  }, [onClose]);
  
  const handleAppClick = useCallback((appKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Attempting to open application:', appKey);
    const app = APPLICATIONS.find(app => app.key === appKey);
    if (app) {
      console.log('Found application:', app.name);
      onOpen(app);
      onClose();
    }
  }, [onOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="absolute left-0 bottom-[44px] z-[1100] border-3 border-retro-dark bg-retro-white rounded-lg w-[360px] text-retro-dark origin-bottom-left"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          initial={{ opacity: 0, y: 20, scale: 0.95, scaleY: 0.4 }}
          animate={{ opacity: 1, y: 0, scale: 1, scaleY: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98, scaleY: 0.4 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            mass: 1
          }}
        >
          {/* Header */}
          <div className="h-[72px] w-full bg-retro-blue border-b-3 border-retro-dark px-4 py-2 flex items-center rounded-t-[5px]">
            <div className="w-12 h-12 mr-3 relative">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={48} 
                height={48}
                className="rounded"
              />
            </div>
            <h3 className="text-2xl font-bold my-auto pt-1">Ismail Feham</h3>
          </div>
          
          {/* Main Content */}
          <div className="flex h-[350px]">
            {/* Left column - Applications */}
            <div 
              className="w-3/5 p-2 overflow-y-auto border-r-3 border-retro-dark scrollbar-thin scrollbar-thumb-retro-dark scrollbar-track-retro-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-lg font-bold my-2 pl-2">Applications</h4>
              <div className="flex flex-col gap-1">
                {APPLICATIONS.map(app => (
                  <button 
                    key={app.key}
                    className="flex items-center px-2 py-1.5 rounded hover:bg-retro-medium text-left"
                    onClick={(e) => handleAppClick(app.key, e)}
                  >
                    <Icon icon={app.icon} size={24} className="mr-3" />
                    <span className="font-medium">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Right column - Menus */}
            <div 
              className="w-2/5 p-2 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-lg font-bold my-2 pl-2">Theme</h4>
              <div className="flex flex-col gap-1">
                {THEMES.map(theme => (
                  <button 
                    key={theme.name}
                    className="flex items-center px-2 py-1.5 rounded hover:bg-retro-medium text-left"
                    onClick={(e) => setTheme(theme.value, e)}
                  >
                    <div className={`w-5 h-5 mr-3 border border-retro-dark rounded ${theme.background}`}></div>
                    <span className="font-medium">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div 
            className="h-[54px] w-full border-t-3 border-retro-dark p-2 flex items-center justify-end gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="flex items-center gap-2 px-3 py-1.5 bg-retro-yellow border-2 border-retro-dark rounded hover:bg-opacity-80"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
            >
              <Icon icon="minimize" size={16} />
              <span className="font-bold">Sleep</span>
            </button>
            <button 
              className="flex items-center gap-2 px-3 py-1.5 bg-retro-red border-2 border-retro-dark rounded hover:bg-opacity-80"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
            >
              <Icon icon="close" size={16} />
              <span className="font-bold">Turn Off</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartMenu; 