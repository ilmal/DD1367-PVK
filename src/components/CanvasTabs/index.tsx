import React, { useState, useEffect, useRef } from "react";
import { IoCloseOutline } from "react-icons/io5";

interface Canvas {
  id: number;
  name: string;
}

interface CanvasTabsProps {
  canvases: Canvas[];
  activeCanvasId: number;
  setActiveCanvasId: (id: number) => void;
  addCanvas: () => void;
  removeCanvas: (id: number) => void;
  renameCanvas: (id: number, newName: string) => void;
  duplicateCanvas: (id: number) => void;
  reorderCanvases: (startIndex: number, endIndex: number) => void;
}

export const CanvasTabs: React.FC<CanvasTabsProps> = ({
  canvases,
  activeCanvasId,
  setActiveCanvasId,
  addCanvas,
  removeCanvas,
  renameCanvas,
  duplicateCanvas,
  reorderCanvases,
}) => {
  // State for context menu and renaming
  const [editingCanvasId, setEditingCanvasId] = useState<number | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  
  // useRef for the dropdown menu (used to detect outside clicks)
  const menuRef = useRef<HTMLDivElement>(null);
  
  // useRef to store the index of the dragged tab
  const draggedTabIndex = useRef<number | null>(null);

  // Close the menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setEditingCanvasId(null);
        setIsRenaming(false);
      }
    };
    if (editingCanvasId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingCanvasId]);

  const handleRenameSubmit = () => {
    if (editingCanvasId !== null && newName.trim() !== "") {
      renameCanvas(editingCanvasId, newName.trim());
    }
    setEditingCanvasId(null);
    setIsRenaming(false);
  };

  return (
    <div className="flex items-center border-b border-gray-300 bg-gray-200">
      {canvases.map((canvas, index) => (
        <div
          key={canvas.id}
          draggable
          onDragStart={(e) => {
            draggedTabIndex.current = index;
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            if (
              draggedTabIndex.current !== null &&
              draggedTabIndex.current !== index
            ) {
              reorderCanvases(draggedTabIndex.current, index);
            }
            draggedTabIndex.current = null;
          }}
          className={`relative flex min-w-fit px-3 py-2 cursor-pointer select-none ${
            canvas.id === activeCanvasId
              ? "bg-white border-t border-l border-r rounded-t shadow"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setActiveCanvasId(canvas.id)}
          onContextMenu={(e) => {
            e.preventDefault();
            // Toggle context menu for this canvas
            setEditingCanvasId(canvas.id === editingCanvasId ? null : canvas.id);
            setIsRenaming(false);
          }}
        >
          {canvas.name}
          {/* Close button */}
          <span
            onClick={(e) => {
              e.stopPropagation();
              removeCanvas(canvas.id);
            }}
            className="ml-2 p-1 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full"
            title="Delete canvas"
          >
            <IoCloseOutline className="text-sm" />
          </span>

          {/* Dropdown Context Menu */}
          {editingCanvasId === canvas.id && (
            <div
              ref={menuRef}
              className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-1">
                {isRenaming ? (
                  <div className="px-4 py-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="border rounded px-2 py-1 w-full text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRenameSubmit();
                        } else if (e.key === "Escape") {
                          setEditingCanvasId(null);
                          setIsRenaming(false);
                        }
                      }}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => {
                          setEditingCanvasId(null);
                          setIsRenaming(false);
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRenameSubmit}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setNewName(canvas.name);
                        setIsRenaming(true);
                      }}
                    >
                      Rename
                    </div>
                    <div
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        duplicateCanvas(canvas.id);
                        setEditingCanvasId(null);
                      }}
                    >
                      Duplicate
                    </div>
                    <div
                      className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        removeCanvas(canvas.id);
                        setEditingCanvasId(null);
                      }}
                    >
                      Delete
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      {/* Area to add a new canvas on double click */}
      <div className="w-full h-full" onDoubleClick={addCanvas} />
    </div>
  );
};
