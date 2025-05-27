import React, { FC } from "react";
import { useOutletContext } from "react-router-dom";
import { CanvasArea } from "../components/CanvasArea";
import { CanvasTabs } from "../components/CanvasTabs";

interface Canvas {
  id: number;
  name: string;
}

interface OutletContextType {
  shapes: any[]; // Replace 'any' with your Shape type if desired.
  connections: any[];
  setShapes: React.Dispatch<React.SetStateAction<any[]>>;
  setConnections: React.Dispatch<React.SetStateAction<any[]>>;
  handleAddObject: (type: string) => void;
  canvases: Canvas[];
  activeCanvasId: number;
  setActiveCanvasId: (id: number) => void;
  addCanvas: () => void;
  removeCanvas: (id: number) => void;
  renameCanvas: (id: number, newName: string) => void;
  duplicateCanvas: (id: number) => void;
  reorderCanvases: (startIndex: number, endIndex: number) => void;
  code: string;
  onCodeUpdate: (newCode: string) => void;
}

export const IndexPage: FC = () => {
  const {
    shapes,
    connections,
    setShapes,
    setConnections,
    canvases,
    activeCanvasId,
    setActiveCanvasId,
    addCanvas,
    removeCanvas,
    renameCanvas,
    duplicateCanvas,
    reorderCanvases,  
    code,
    onCodeUpdate,
  } = useOutletContext<OutletContextType>();

  return (
    <div className="w-full h-full flex flex-col">
      {/* Tab bar for canvases */}
      <CanvasTabs 
        canvases={canvases} 
        activeCanvasId={activeCanvasId} 
        setActiveCanvasId={setActiveCanvasId} 
        addCanvas={addCanvas} 
        removeCanvas={(id) => {
          removeCanvas(id);
        }}
        renameCanvas={(id, newName)=>{
          renameCanvas(id, newName);
        }}
        duplicateCanvas={(id)=>{
          duplicateCanvas(id)
        }}
        reorderCanvases={(startIndex, endIndex)=>{
          reorderCanvases(startIndex, endIndex)
        }}
      />
      {/* Canvas area */}
      <div className="flex-1 relative">
        <CanvasArea 
          shapes={shapes}
          connections={connections}
          onShapesUpdate={setShapes}
          onConnectionsUpdate={setConnections}
          code={code}
          onCodeUpdate={onCodeUpdate} terminalHeight={0} isTerminalCollapsed={false} setTerminalHeight={function (height: number): void {
            throw new Error("Function not implemented.");
          } } setIsTerminalCollapsed={function (collapsed: boolean): void {
            throw new Error("Function not implemented.");
          } }        />
      </div>
    </div>
  );
};
