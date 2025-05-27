import React, { FC } from "react";
import { CanvasArea } from "../components/CanvasArea";
import { useOutletContext } from "react-router-dom";
import { Shape, Connection } from "../components/Layout";

interface OutletContextType {
  shapes: Shape[];
  connections: Connection[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
}

export const IndexPage: FC = () => {
  const { shapes, connections, setShapes, setConnections } = useOutletContext<OutletContextType>();

  return (
    <div className="w-full h-full flex">
      <div className="flex-1 relative">
        <CanvasArea
          shapes={shapes}
          connections={connections}
          onShapesUpdate={setShapes}
          onConnectionsUpdate={setConnections} code={""} onCodeUpdate={function (code: string): void {
            throw new Error("Function not implemented.");
          } } terminalHeight={0} isTerminalCollapsed={false} setTerminalHeight={function (height: number): void {
            throw new Error("Function not implemented.");
          } } setIsTerminalCollapsed={function (collapsed: boolean): void {
            throw new Error("Function not implemented.");
          } }        />
      </div>
    </div>
  );
};
