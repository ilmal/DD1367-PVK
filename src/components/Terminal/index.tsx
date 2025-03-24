import React, { useState, useRef, useEffect } from 'react';

export const Terminal: React.FC = () => {
  // Height states: current height and previous expanded height.
  const [height, setHeight] = useState<number>(150);
  const [expandedHeight, setExpandedHeight] = useState<number>(150);
  // Dragging and collapse state.
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(0);

  // Terminal command and output state.
  const [output, setOutput] = useState<string[]>([]);
  const [command, setCommand] = useState<string>("");
  const outputRef = useRef<HTMLDivElement>(null);

  // Only allow dragging when not collapsed.
  const onMouseDown = (e: React.MouseEvent) => {
    if (collapsed) return;
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const delta = startYRef.current - e.clientY;
    const newHeight = startHeightRef.current + delta;
    if (newHeight < 50) {
      setHeight(50);
    } else if (newHeight > 500) {
      setHeight(500);
    } else {
      setHeight(newHeight);
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  // Process a command and update terminal output.
  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (trimmed === "") return;

    let response = "";
    if (trimmed === "help") {
      response = "Available commands: help, echo <text>, date, clear";
    } else if (trimmed.startsWith("echo ")) {
      response = trimmed.substring(5);
    } else if (trimmed === "date") {
      response = new Date().toString();
    } else if (trimmed === "clear") {
      setOutput([]);
      return;
    } else {
      response = `Command not found: ${trimmed}`;
    }
    setOutput(prev => [...prev, `$ ${trimmed}`, response]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processCommand(command);
      setCommand("");
    }
  };

  // Auto-scroll to the bottom when new output is added.
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Toggle collapse/expand. When collapsing, store the current height.
  const toggleTerminal = () => {
    if (collapsed) {
      // Expand: restore previous height.
      setHeight(expandedHeight);
    } else {
      // Collapse: store current height and reduce to header height.
      setExpandedHeight(height);
      setHeight(30);
    }
    setCollapsed(!collapsed);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white flex flex-col" style={{ height }}>
      {/* Terminal header with drag handle and toggle button */}
      <div
        className="h-8 bg-gray-700 flex items-center justify-between px-2 cursor-row-resize"
        onMouseDown={onMouseDown}
      >
        <span>Terminal</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTerminal();
          }}
          className="bg-gray-600 px-2 py-1 rounded text-sm"
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
      {/* Show output and input only when not collapsed */}
      {!collapsed && (
        <>
          <div ref={outputRef} className="flex-1 p-2 overflow-auto font-mono text-sm">
            {output.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          <div className="p-2 border-t border-gray-700 flex items-center">
            <span className="mr-2">$</span>
            <input
              type="text"
              className="bg-transparent outline-none w-full"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
        </>
      )}
    </div>
  );
};
