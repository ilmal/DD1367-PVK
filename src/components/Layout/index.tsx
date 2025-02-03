// components/Layout/index.tsx
import React, { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Titlebar } from '../Titlebar';
import { SideBar } from '../SideBar';

declare global {
  interface Window {
    electron: any;
  }
}

export const Layout: FC = () => {
  useEffect(() => {
    if (!window.electron) return;

    window.electron.ipcRenderer.send('app_version');
    window.electron.ipcRenderer.on('app_version', (arg: any) => {
      console.log('App version:', arg.version);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('app_version');
    };
  }, []);

  return (
    <div className="min-h-[800px] min-w-[1200px] overflow-hidden">
      <Titlebar />
      <div className="h-screen flex">
        <SideBar />
        <main className="flex-1 overflow-auto bg-white select-none flex flex-row">
          <Outlet />
        </main>
      </div>
    </div>
  );
};