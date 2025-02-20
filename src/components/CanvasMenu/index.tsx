import React, { useState } from "react";

interface CanvasMenuProps {
  onAddObject: (type: string) => void;
}

type CanvasComponent = {
  type: string;
  label: string;
};

type ComponentCategory = {
  category: string;
  components: CanvasComponent[];
};

export const componentsData: ComponentCategory[] = [
  {
    category: "Sensors",
    components: [{ type: "sensor", label: "Add Sensor" }],
  },
  {
    category: "Logic",
    components: [
      { type: "if", label: "Add If" },
      { type: "output", label: "Add Output" },
    ],
  },
];

export const CanvasMenu: React.FC<CanvasMenuProps> = ({ onAddObject }) => {
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>(
    () =>
      componentsData.reduce((acc, curr) => {
        acc[curr.category] = true; // Open all categories by default
        return acc;
      }, {} as { [key: string]: boolean })
  );

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <aside className="bg-black h-full w-64 p-4">
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Components</h2>
        {componentsData.map((cat) => (
          <div key={cat.category} className="mb-3">
            <button
              onClick={() => toggleCategory(cat.category)}
              className="w-full flex items-center justify-between text-left focus:outline-none"
            >
              <span className="font-medium">{cat.category}</span>
              <span className="transition-transform duration-200 transform">
                {openCategories[cat.category] ? "▼" : "►"}
              </span>
            </button>
            {openCategories[cat.category] && (
              <div className="mt-2 pl-4">
                {cat.components.map((component) => (
                  <button
                    key={component.type}
                    onClick={() => onAddObject(component.type)}
                    className="w-full text-left p-2 border border-gray-300 rounded mb-2 hover:bg-gray-100 focus:outline-none"
                  >
                    {component.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};
