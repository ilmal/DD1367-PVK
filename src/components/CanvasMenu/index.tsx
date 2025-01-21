import React from "react";

interface CanvasMenuProps {
  onAddObject: (type: string) => void;
  onConnectShapes: (fromId: number, toId: number) => void;
}

export const CanvasMenu: React.FC<CanvasMenuProps> = ({ onAddObject, onConnectShapes }) => {
  return (
    <aside className="w-64 bg-white text-gray-800 p-4 flex flex-col">
      <h2 className="text-lg mb-4">Objects</h2>
      <button
        onClick={() => onAddObject("circle")}
        className="bg-gray-700 text-white rounded mb-2 p-2 hover:bg-gray-600"
      >
        Add Circle
      </button>
      <button
        onClick={() => onAddObject("rectangle")}
        className="bg-gray-700 text-white rounded mb-2 p-2 hover:bg-gray-600"
      >
        Add Rectangle
      </button>
      <button
        onClick={() => onConnectShapes(1, 2)}
        className="bg-gray-700 text-white rounded mb-2 p-2 hover:bg-gray-600"
      >
        Connect #1 & #2
      </button>
    </aside>
  );
};
