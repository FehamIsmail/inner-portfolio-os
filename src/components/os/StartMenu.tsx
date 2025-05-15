import React from 'react';
import Image from 'next/image';
import Icon from '@/components/common/Icon';
import { APPLICATIONS } from '@/constants/data';
import { useDesktop } from '@/hooks/useDesktop';

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
  const { addWindow } = useDesktop();
  
  const setTheme = (backgroundColor: string) => {
    document.documentElement.style.setProperty('--color-retro-background', backgroundColor);
    const event = new Event('themeChanged');
    document.dispatchEvent(event);
    onClose();
  };
  
  const handleAppClick = (appKey: string) => {
    const app = APPLICATIONS.find(app => app.key === appKey);
    if (app) {
      addWindow(app);
      onClose();
    }
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="absolute left-0 bottom-[40px] z-[1100] border-3 border-retro-dark bg-retro-white rounded-t-lg rounded-r-lg w-[360px] text-retro-dark"
      onClick={(e) => e.stopPropagation()}
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
        <div className="w-3/5 p-2 overflow-y-auto border-r-3 border-retro-dark scrollbar-thin scrollbar-thumb-retro-dark scrollbar-track-retro-white">
          <h4 className="text-lg font-bold mb-2 pl-2">Applications</h4>
          <div className="flex flex-col gap-1">
            {APPLICATIONS.map(app => (
              <button 
                key={app.key}
                className="flex items-center px-2 py-1.5 rounded hover:bg-retro-medium text-left"
                onClick={() => handleAppClick(app.key)}
              >
                <Icon icon={app.icon} size={24} className="mr-3" />
                <span className="font-medium">{app.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Right column - Menus */}
        <div className="w-2/5 p-2 overflow-y-auto">
          <h4 className="text-lg font-bold mb-2 pl-2">Theme</h4>
          <div className="flex flex-col gap-1">
            {THEMES.map(theme => (
              <button 
                key={theme.name}
                className="flex items-center px-2 py-1.5 rounded hover:bg-retro-medium text-left"
                onClick={() => setTheme(theme.value)}
              >
                <div className={`w-5 h-5 mr-3 border border-retro-dark rounded ${theme.background}`}></div>
                <span className="font-medium">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="h-[48px] w-full border-t-3 border-retro-dark px-4 py-2 flex items-center justify-end gap-3">
        <button 
          className="flex items-center gap-2 px-3 py-1.5 bg-retro-yellow border-2 border-retro-dark rounded hover:bg-opacity-80"
          onClick={onClose}
        >
          <Icon icon="minimize" size={16} />
          <span className="font-bold">Sleep</span>
        </button>
        <button 
          className="flex items-center gap-2 px-3 py-1.5 bg-retro-red border-2 border-retro-dark rounded hover:bg-opacity-80"
          onClick={onClose}
        >
          <Icon icon="close" size={16} />
          <span className="font-bold">Turn Off</span>
        </button>
      </div>
    </div>
  );
};

export default StartMenu; 