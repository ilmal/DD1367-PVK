import React, { FC, useState, useCallback } from "react";
import { Layout } from "../components/Layout";
import { CanvasArea } from "../components/CanvasArea";

let idCounter = 3;

export const IndexPage: FC = () => {
  const [shapes, setShapes] = useState([
    { id: 1, type: "circle", x: 150, y: 120 },
    { id: 2, type: "rectangle", x: 350, y: 200 },
  ]);

  const [connections, setConnections] = useState<{ fromId: number; toId: number }[]>([]);

  const handleAddCircle = useCallback(() => {
    setShapes((prev) => [
      ...prev,
      { id: idCounter++, type: "circle", x: 200, y: 200 },
    ]);
  }, []);

  const handleAddRectangle = useCallback(() => {
    setShapes((prev) => [
      ...prev,
      { id: idCounter++, type: "rectangle", x: 400, y: 200 },
    ]);
  }, []);

  const handleShapesUpdate = (updated: any[]) => {
    setShapes(updated);
  };

  const handleConnectionsUpdate = (updated: { fromId: number; toId: number }[]) => {
    setConnections(updated);
  };

  return (
    <Layout>
      <div className="flex flex-row w-full h-full">
        <aside className="w-64 p-4 bg-gray-200 flex flex-col space-y-2">
          <button className="bg-blue-600 text-white p-2 rounded" onClick={handleAddCircle}>
            Add Circle
          </button>
          <button className="bg-blue-600 text-white p-2 rounded" onClick={handleAddRectangle}>
            Add Rectangle
          </button>
        </aside>
        <div className="flex-1">
          <CanvasArea
            shapes={shapes}
            connections={connections}
            onShapesUpdate={handleShapesUpdate}
            onConnectionsUpdate={handleConnectionsUpdate}
          />
        </div>
      </div>
    </Layout>
  );
};
