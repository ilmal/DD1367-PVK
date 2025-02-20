// components/Layout/index.tsx
import React, { FC, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Titlebar } from '../Titlebar';
import { SideBar } from '../SideBar';

declare global {
  interface Window {
    electron: any;
  }
}

export interface Shape {
  id: number;
  type: 'sensor' | 'output' | 'if';
  x: number;
  y: number;
}

export interface Connection {
  fromId: number;
  toId: number;
}

let shapeCounter = 3;

export const Layout: FC = () => {

  const [shapes, setShapes] = useState<Shape[]>([
    { id: 1, type: "sensor", x: 150, y: 120 },
    { id: 2, type: "output", x: 350, y: 200 },
  ]);
  const [connections, setConnections] = useState<Connection[]>([]);

  // This function adds a new shape based on the type.
  const handleAddObject = (type: string) => {
    if (type === "sensor") {
      setShapes((prev) => [
        ...prev,
        { id: shapeCounter++, type: "sensor", x: 200, y: 200 },
      ]);
    } else if (type === "output") {
      setShapes((prev) => [
        ...prev,
        { id: shapeCounter++, type: "output", x: 300, y: 300 },
      ]);
    } else if (type === "if") {
      setShapes((prev) => [
        ...prev,
        { id: shapeCounter++, type: "if", x: 400, y: 250 },
      ]);
    }
  };

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
        {/* Pass handleAddObject to the Sidebar */}
        <SideBar onAddObject={handleAddObject} />
        <main className="flex-1 overflow-auto bg-white select-none flex flex-row">
          {/* Pass canvas state via context to the Outlet */}
          <Outlet context={{ shapes, connections, setShapes, setConnections }} />
        </main>
      </div>
    </div>
  );
};