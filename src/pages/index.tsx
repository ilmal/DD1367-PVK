import React, { FC, useState } from "react";
import { CanvasArea } from "../components/CanvasArea";
import { CanvasMenu } from "../components/CanvasMenu";

interface Shape {
  id: number;
  type: "sensor" | "output" | "if";
  x: number;
  y: number;
}
interface Connection {
  fromId: number;
  toId: number;
}

let shapeCounter = 3;

export const IndexPage: FC = () => {
  const [shapes, setShapes] = useState<Shape[]>([
    { id: 1, type: "sensor", x: 150, y: 120 },
    { id: 2, type: "output", x: 350, y: 200 },
  ]);
  const [connections, setConnections] = useState<Connection[]>([]);

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

  const handleShapesUpdate = (updated: Shape[]) => setShapes(updated);
  const handleConnectionsUpdate = (updated: Connection[]) =>
    setConnections(updated);

  return (
    <div className="w-full h-full flex">
      <CanvasMenu onAddObject={handleAddObject} />
      <div className="flex-1 relative">
        <CanvasArea
          shapes={shapes}
          connections={connections}
          onShapesUpdate={handleShapesUpdate}
          onConnectionsUpdate={handleConnectionsUpdate}
        />
      </div>
    </div>
  );
};
