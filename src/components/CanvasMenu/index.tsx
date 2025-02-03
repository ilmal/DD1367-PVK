import React from "react";

interface CanvasMenuProps {
  onAddObject: (type: string) => void;
}

export const CanvasMenu: React.FC<CanvasMenuProps> = ({ onAddObject }) => {
  return (
    <aside className="w-64 bg-white text-gray-800 p-4 flex flex-col">
      <h2 className="text-lg mb-4">Components</h2>
      <button
        onClick={() => onAddObject("sensor")}
        className="bg-gray-700 text-white rounded mb-2 p-2 hover:bg-gray-600"
      >
        Add Sensor
      </button>
      <button
        onClick={() => onAddObject("output")}
        className="bg-gray-700 text-white rounded mb-2 p-2 hover:bg-gray-600"
      >
        Add Output
      </button>
      <button
        onClick={() => onAddObject("if")}
        className="bg-gray-700 text-white rounded mb-2 p-2 hover:bg-gray-600"
      >
        Add If
      </button>
    </aside>
  );
};
