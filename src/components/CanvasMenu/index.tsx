import React from "react";

interface CanvasMenuProps {
  onAddObject: (type: string) => void;
}

export const CanvasMenu: React.FC<CanvasMenuProps> = ({ onAddObject }) => {
  return (
    <aside className="w-64 bg-white text-gray-800 p-4 flex flex-col justify-center">
      <h2 className="text-lg mb-4">Objects</h2>

      {/* Example buttons to add shapes */}
      <button
        onClick={() => onAddObject("circle")}
        className="bg-gray-700 rounded mb-2 p-2 hover:bg-gray-600"
      >
        Add Circle
      </button>
      <button
        onClick={() => onAddObject("rectangle")}
        className="bg-gray-700 rounded mb-2 p-2 hover:bg-gray-600"
      >
        Add Rectangle
      </button>
    </aside>
  );
};
