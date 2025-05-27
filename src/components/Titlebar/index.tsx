import { FC, useEffect, useState } from 'react';
import {
  IoCloseOutline,
  IoContractOutline,
  IoExpandOutline,
  IoRemove,
} from 'react-icons/io5';
import cirrus from '../../assets/cirrus.jpg';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string) => void;
        invoke: (channel: string) => Promise<any>;
        on: (channel: string, listener: (...args: any[]) => void) => void;
        removeListener: (channel: string, listener: (...args: any[]) => void) => void;
      };
    };
  }
}

export const Titlebar: FC = () => {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (!window.electron) {
      console.error('Electron API not available');
      return;
    }

    const handleMaximize = () => setMaximized(true);
    const handleUnmaximize = () => setMaximized(false);

    window.electron.ipcRenderer.on('window-maximized', handleMaximize);
    window.electron.ipcRenderer.on('window-unmaximized', handleUnmaximize);

    // Check initial maximized state
    window.electron.ipcRenderer.invoke('check-maximized').then((isMaximized: boolean) => {
      setMaximized(isMaximized);
    }).catch((err: any) => {
      console.error('Failed to check maximized state:', err);
    });

    return () => {
      window.electron.ipcRenderer.removeListener('window-maximized', handleMaximize);
      window.electron.ipcRenderer.removeListener('window-unmaximized', handleUnmaximize);
    };
  }, []);

  const onMinimize = () => {
    window.electron?.ipcRenderer.send('minimize-window');
  };

  const onMaximize = () => {
    window.electron?.ipcRenderer.send('maximize-window');
  };

  const onQuit = () => {
    window.electron?.ipcRenderer.send('quit-app');
  };

  return (
    <div className="h-8 title-bar sticky top-0 select-none flex flex-row">
      <div className="menu-button-container">
        <img
          id="icon"
          src={cirrus}
          className="menu-icon select-none"
          alt="cirrus"
        />
      </div>
      <div className="app-name-container select-none">
        <p>PVK go brrrr</p>
      </div>
      <div className="window-controls-container">
        <button
          title="Minimize"
          className="minimize-button focus:outline-none hover:bg-gray-700"
          onClick={onMinimize}
        >
          <IoRemove />
        </button>
        <button
          title="Maximize"
          className="min-max-button focus:outline-none hover:bg-gray-700"
          onClick={onMaximize}
        >
          {maximized ? <IoContractOutline /> : <IoExpandOutline />}
        </button>
        <button
          title="Close"
          className="close-button focus:outline-none hover:bg-gray-700"
          onClick={onQuit}
        >
          <IoCloseOutline />
        </button>
      </div>
    </div>
  );
};