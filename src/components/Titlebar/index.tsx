// components/Titlebar/index.tsx
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
    electron: any;
  }
}

export const Titlebar: FC = () => {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (!window.electron) return;
    
    const currentWindow = window.electron.remote.getCurrentWindow();
    setMaximized(currentWindow.isMaximized());

    const updateMaximized = () => setMaximized(currentWindow.isMaximized());
    currentWindow.on('maximize', updateMaximized);
    currentWindow.on('unmaximize', updateMaximized);

    return () => {
      currentWindow.removeListener('maximize', updateMaximized);
      currentWindow.removeListener('unmaximize', updateMaximized);
    };
  }, []);

  const onMinimize = () => window.electron?.remote.getCurrentWindow().minimize();
  const onMaximize = () => {
    const win = window.electron?.remote.getCurrentWindow();
    win.isMaximized() ? win.unmaximize() : win.maximize();
  };
  const onQuit = () => window.electron?.ipcRenderer.send('quit-app');

  return (
    <div className="title-bar sticky top-0 select-none flex flex-row">
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