import { Layout } from "../components/Layout";
import React, { FC, useState, useCallback } from "react";
import { CanvasArea } from "../components/CanvasArea";
import { CanvasMenu } from "../components/CanvasMenu";

interface Shape {
  type: string;
  x: number;
  y: number;
}

export const IndexPage: FC = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);

  // Example: function to add a shape to the canvas
  const handleAddObject = useCallback((type: string) => {
    const x = Math.random() * 500 + 50;
    const y = Math.random() * 400 + 50;
    setShapes((prev) => [...prev, { type, x, y }]);
  }, []);


	return (
		<Layout>
        <div className="flex-1 overflow-auto bg-white select-none flex flex-row">
          <CanvasMenu onAddObject={handleAddObject} />
          {/* Large canvas area */}
          <div className="flex-1 p-2">
            <CanvasArea shapes={shapes} />
          </div>
        </div>
		</Layout>
	);
};
