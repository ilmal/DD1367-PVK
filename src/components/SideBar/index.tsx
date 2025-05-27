import { FC, useState, useEffect } from "react";
import { CanvasMenu } from "../CanvasMenu";
import { LuFolder, LuFastForward, LuFile, LuSearch, LuDatabase, LuCircuitBoard, LuGitPullRequest, LuLayoutGrid, LuRadioReceiver, LuComputer, LuServer, LuWrench } from 'react-icons/lu';
import { useNavigate } from "react-router-dom";

interface MenuItem {
  id: string;
  icon: JSX.Element | string;
  label: string;
  onClick: () => void;
}


export const SideBar: React.FC<any> = ({ onAddObject }) => {

  const [collapsed, setCollapsed] = useState(false);
  const [showCanvasMenu, setShowCanvasMenu] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);

  // Add navigation effect
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedMenuItem) {
      navigate(`/${selectedMenuItem}`);
    }
  }, [selectedMenuItem, navigate]);

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
        setSelectedMenuItem("runSimulation");
      }
    },
    {
      id: "newCanvas",
      icon: <LuFile />,
      label: "New Canvas",
      onClick: () => {
        setSelectedMenuItem("newCanvas");
      }
    },
    {
      id: "search",
      icon: <LuSearch />,
      label: "Search",
      onClick: () => {
        setSelectedMenuItem("search");
      }
    },
    {
      id: "database",
      icon: <LuDatabase />,
      label: "Database",
      onClick: () => {
        setSelectedMenuItem("database");
      }
    },
    {
      id: "boardInterface",
      icon: <LuCircuitBoard />,
      label: "Board Interface",
      onClick: () => {
        setSelectedMenuItem("boardInterface");
      }
    },
    {
      id: "versionControl",
      icon: <LuGitPullRequest />,
      label: "Version Control",
      onClick: () => {
        setSelectedMenuItem("versionControl");
      }
    },
    {
      id: "moduleHierarchy",
      icon: <LuLayoutGrid />,
      label: "Module Hierarchy",
      onClick: () => {
        setSelectedMenuItem("moduleHierarchy");
      }
    },
    {
      id: "registersAndMemory",
      icon: <LuRadioReceiver />,
      label: "Registers & Memory",
      onClick: () => {
        setSelectedMenuItem("registersAndMemory");
      }
    },
    {
      id: "simulationViewer",
      icon: <LuComputer />,
      label: "Simulation Viewer",
      onClick: () => {
        setSelectedMenuItem("simulationViewer");
      }
    },
    {
      id: "testBench",
      icon: <LuServer />,
      label: "Test Bench",
      onClick: () => {
        setSelectedMenuItem("testBench");
      }
    },
    {
      id: "configure",
      icon: <LuWrench />,
      label: "Configure",
      onClick: () => {
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
