import React, { FC, useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { SideBar } from '../SideBar';
import { Titlebar } from '../Titlebar';
import { renameSync } from 'fs';


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

interface Canvas {
  id: number;
  name: string;
}

interface CanvasData {
  id: number;
  name: string;
  shapes: Shape[];
  connections: Connection[];
  code: string;
}

export const Layout: FC = () => {
  // Initialize canvases state with one default canvas, including a code snippet.
  const [canvases, setCanvases] = useState<CanvasData[]>([
    {
      id: 1,
      name: "Canvas 1",
      shapes: [
        { id: 1, type: "sensor", x: 150, y: 120 },
        { id: 2, type: "output", x: 350, y: 200 },
      ],
      connections: [],
      code: `// Canvas 1 code
function hello() {
  console.log("Hello, Canvas 1!");
}`
    },
  ]);
  const [activeCanvasId, setActiveCanvasId] = useState<number>(1);
  
  // Use a ref for shapeCounter to ensure unique shape IDs.
  const shapeCounter = useRef(3);

  // Get active canvas data.
  const activeCanvas = canvases.find(c => c.id === activeCanvasId);
  if (!activeCanvas) return null;

  // Update active canvas shapes.
  const handleShapesUpdate = (newShapes: Shape[]) => {
    setCanvases(prev =>
      prev.map(canvas =>
        canvas.id === activeCanvasId ? { ...canvas, shapes: newShapes } : canvas
      )
    );
  };

  // Update active canvas connections.
  const handleConnectionsUpdate = (newConnections: Connection[]) => {
    setCanvases(prev =>
      prev.map(canvas =>
        canvas.id === activeCanvasId ? { ...canvas, connections: newConnections } : canvas
      )
    );
  };

  // Update active canvas code.
  const handleCodeUpdate = (newCode: string) => {
    setCanvases(prev =>
      prev.map(canvas =>
        canvas.id === activeCanvasId ? { ...canvas, code: newCode } : canvas
      )
    );
  };

  // Add new object to active canvas.
  const handleAddObject = (type: Shape['type']) => {
    const defaultX = 250;
    const defaultY = 250;
    
    const newShape: Shape = {
      id: shapeCounter.current++,
      type,
      x: defaultX,
      y: defaultY
    };
    
    handleShapesUpdate([...activeCanvas.shapes, newShape]);
  };

  // Function to add a new canvas, with a unique code snippet.
  const addCanvas = () => {
    const newId = canvases.length ? Math.max(...canvases.map(c => c.id)) + 1 : 1;
    const newCanvas: CanvasData = {
      id: newId,
      name: `Canvas ${newId}`,
      shapes: [],
      connections: [],
      code: `// Canvas ${newId} code
function hello() {
  console.log("Hello, Canvas ${newId}!");
}`
    };
    setCanvases([...canvases, newCanvas]);
    setActiveCanvasId(newId);
  };

  const removeCanvas = (id: number) => {
    setCanvases(prev => prev.filter(c => c.id !== id));
    setActiveCanvasId(canvases[0].id);
  }

  const renameCanvas = (id: number, newName: string) => {
    setCanvases(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
  }

  // Duplicate a canvas: create a copy with a new id and modified name.
  const duplicateCanvas = (id: number) => {
    const canvasToDuplicate = canvases.find((c) => c.id === id);
    if (canvasToDuplicate) {
      // Create a new unique id
      const newId = canvases.length ? Math.max(...canvases.map(c => c.id)) + 1 : 1;
      const duplicatedCanvas: CanvasData = {
        ...canvasToDuplicate,
        id: newId,
        name: `${canvasToDuplicate.name} copy`,
      };
      // Insert the duplicated canvas after the original one
      const index = canvases.findIndex((c) => c.id === id);
      const updatedCanvases = [
        ...canvases.slice(0, index + 1),
        duplicatedCanvas,
        ...canvases.slice(index + 1),
      ];
      setCanvases(updatedCanvases);
    }
  };

  // Reorder canvases when a canvas tab is dragged and dropped.
  const reorderCanvases = (startIndex: number, endIndex: number) => {
    const updatedCanvases = Array.from(canvases);
    const [removed] = updatedCanvases.splice(startIndex, 1);
    updatedCanvases.splice(endIndex, 0, removed);
    setCanvases(updatedCanvases);
  };
  

  if (!activeCanvas) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen min-w-[1200px] overflow-hidden">
      <Titlebar />
      <div className="max-h-[97vh] h-full flex">
        <SideBar onAddObject={handleAddObject} />
        <main className="flex-1 overflow-auto bg-white select-none flex flex-col">
          {/* Pass active canvas data and functions via Outlet context */}
          <Outlet context={{
            shapes: activeCanvas.shapes,
            connections: activeCanvas.connections,
            setShapes: handleShapesUpdate,
            setConnections: handleConnectionsUpdate,
            handleAddObject: handleAddObject,
            canvases: canvases,
            activeCanvasId: activeCanvasId,
            setActiveCanvasId: setActiveCanvasId,
            addCanvas: addCanvas,
            removeCanvas: removeCanvas,
            renameCanvas: renameCanvas,
            duplicateCanvas: duplicateCanvas,
            reorderCanvases: reorderCanvases,
            code: activeCanvas.code,
            onCodeUpdate: handleCodeUpdate,
          }} />
        </main>
      </div>
    </div>
  );
};
