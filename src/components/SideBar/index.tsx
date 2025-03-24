import { FC, useState } from "react";
import { CanvasMenu } from "../CanvasMenu";
import { LuFolder, LuFastForward, LuFile, LuSearch, LuDatabase, LuCircuitBoard, LuGitPullRequest, LuLayoutGrid, LuRadioReceiver, LuComputer, LuServer, LuWrench } from 'react-icons/lu';

interface MenuItem {
  id: string;
  icon: JSX.Element | string;
  label: string;
  onClick: () => void;
}

interface SideBarProps {
  onAddObject: (type: 'sensor' | 'output' | 'if') => void;
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
      id: "explorer",
      icon: <LuFolder />,
      label: "Explorer",
      onClick: () => {
        setShowCanvasMenu((prev) => !prev);
        setSelectedMenuItem("explorer");
      }
    },
    {
      id: "runSimulation",
      icon: <LuFastForward />,
      label: "Run Simulation",
      onClick: () => {
        setShowCanvasMenu((prev) => !prev);
        setSelectedMenuItem("runSimulation");
      }
    },
    {
      id: "newCanvas",
      icon: <LuFile />,
      label: "New Canvas",
      onClick: () => {
        setShowCanvasMenu((prev) => !prev);
        setSelectedMenuItem("newCanvas");
      }
    },
    {
      id: "search",
      icon: <LuSearch />,
      label: "Search",
      onClick: () => {
        setShowCanvasMenu((prev) => !prev);
        setSelectedMenuItem("search");
      }
    },
    {
      id: "database",
      icon: <LuDatabase />,
      label: "Database",
      onClick: () => {
        setShowCanvasMenu((prev) => !prev);
        setSelectedMenuItem("database");
      }
    },
    {
      id: "boardInterface",
      icon: <LuCircuitBoard />,
      label: "Board Interface",
      onClick: () => {
        setShowCanvasMenu((prev) => !prev);
        setSelectedMenuItem("boardInterface");
      }
    },
    {
      id: "versionControl",
      icon: <LuGitPullRequest />,
      label: "Version Control",
      onClick: () => {
        setShowCanvasMenu((prev) => !prev);
        setSelectedMenuItem("versionControl");
      }
    },
    {
      id: "moduleHierarchy",
      icon: <LuLayoutGrid />,
      label: "Module Hierarchy",
      onClick: () => {
        setShowCanvasMenu((prev) => !prev);
        setSelectedMenuItem("moduleHierarchy");
      }
    },
    {
      id: "registersAndMemory",
      icon: <LuRadioReceiver />,
      label: "Registers & Memory",
      onClick: () => {
        setShowCanvasMenu((prev) => !prev);
        setSelectedMenuItem("registersAndMemory");
      }
    },
    {
      id: "simulationViewer",
      icon: <LuComputer />,
      label: "Simulation Viewer",
      onClick: () => {
        setShowCanvasMenu((prev) => !prev);
        setSelectedMenuItem("simulationViewer");
      }
    },
    {
      id: "testBench",
      icon: <LuServer />,
      label: "Test Bench",
      onClick: () => {
        setShowCanvasMenu((prev) => !prev);
        setSelectedMenuItem("testBench");
      }
    },
    {
      id: "configure",
      icon: <LuWrench />,
      label: "Configure",
      onClick: () => {
        setShowCanvasMenu((prev) => !prev);
        setSelectedMenuItem("configure");
      }
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
      {showCanvasMenu && (
        <div className="w-64 h-full transition-all duration-300">
          {/* Pass the collapsed state to CanvasMenu */}
          <CanvasMenu onAddObject={onAddObject} collapsed={collapsed} />
        </div>
      )}
    </div>
  );
};
