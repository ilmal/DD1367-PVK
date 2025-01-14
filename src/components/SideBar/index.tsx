import { FC, useState } from "react";


export const SideBar: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

	return (
    <aside
    className={`bg-gray-800 text-white flex flex-col transition-all duration-300
      ${collapsed ? "w-16" : "w-64"}
    `}
  >
    <div className="p-2 flex justify-end">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 focus:outline-none"
      >
        ☰
      </button>
    </div>
    <nav className="flex-1 p-2">
      {/* Navigationslänkar eller menyinnehåll */}
      <ul className="space-y-2">
        <li className="hover:bg-gray-700 p-2 rounded">Meny 1</li>
        <li className="hover:bg-gray-700 p-2 rounded">Meny 2</li>
        <li className="hover:bg-gray-700 p-2 rounded">Meny 3</li>
      </ul>
    </nav>
  </aside>
);
};
