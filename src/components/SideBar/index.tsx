import { FC, useState } from "react";
import { CanvasMenu } from "../CanvasMenu";
import { LuFolder, LuFastForward, LuFile, LuSearch, LuDatabase, LuCircuitBoard, LuGitPullRequest, LuLayoutGrid, LuRadioReceiver, LuComputer, LuServer, LuWrench } from 'react-icons/lu';

interface MenuItem {
  id: string;
  icon: JSX.Element | string;
  label: string;
  onClick: () => void;
}

export interface SideBarProps {
  onAddObject: (type: string) => void;
}

export const SideBar: React.FC<SideBarProps> = ({ onAddObject }) => {

  const [collapsed, setCollapsed] = useState(false);
  const [showCanvasMenu, setShowCanvasMenu] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);

  const handleAddObject = (type: string) => {
    console.log("Add object:", type);
  };

  const menuItems: MenuItem[] = [
    {
      id: "canvas",
      icon: <LuFolder />,
      label: "Canvas",
      onClick: () => {setShowCanvasMenu((prev) => !prev); setSelectedMenuItem("canvas")},
    },
    {
      id: "Cool thing here",
      icon: <LuFastForward />,
      label: "Cool thing here",
      onClick: () => console.log("Cool thing here clicked"),
    },
    {
      id: "file",
      icon: <LuFile />,
      label: "File",
      onClick: () => console.log("File clicked"),
    },
    {
      id: "search",
      icon: <LuSearch />,
      label: "Search",
      onClick: () => console.log("Search clicked"),
    },
    {
      id: "database",
      icon: <LuDatabase />,
      label: "Database",
      onClick: () => console.log("Database clicked"),
    },
    {
      id: "circuit",
      icon: <LuCircuitBoard />,
      label: "Circuit",
      onClick: () => console.log("Circuit clicked"),
    },
    {
      id: "pull-request",
      icon: <LuGitPullRequest />,
      label: "Pull Request",
      onClick: () => console.log("Pull Request clicked"),
    },
    {
      id: "layout-grid",
      icon: <LuLayoutGrid />,
      label: "Grid Layout",
      onClick: () => console.log("Grid Layout clicked"),
    },
    {
      id: "receiver",
      icon: <LuRadioReceiver />,
      label: "Receiver",
      onClick: () => console.log("Receiver clicked"),
    },
    {
      id: "computer",
      icon: <LuComputer />,
      label: "Computer",
      onClick: () => console.log("Computer clicked"),
    },
    {
      id: "server",
      icon: <LuServer />,
      label: "Server",
      onClick: () => console.log("Server clicked"),
    },
    {
      id: "wrench",
      icon: <LuWrench />,
      label: "Wrench",
      onClick: () => console.log("Wrench clicked"),
    }
  ];

  return (
    <div className="flex">
      <aside
        className={`bg-black text-white flex flex-col transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-2 flex justify-end">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="bg-black px-2 py-1 rounded hover:bg-gray-900 focus:outline-none"
          >
            ☰
          </button>
        </div>
        <nav className="flex-1 p-2">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={item.onClick}
                  className={`flex items-center p-2 rounded w-full focus:outline-none ${
                    item.id === selectedMenuItem ? "bg-gray-700" : "hover:bg-gray-900"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!collapsed && <span className="ml-2">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {(showCanvasMenu && !collapsed) && (
        <div className="w-64 h-full transition-all duration-300">
          {/* Pass the parent's onAddObject to CanvasMenu */}
          <CanvasMenu onAddObject={onAddObject} />
        </div>
      )}
    </div>
  );
};
