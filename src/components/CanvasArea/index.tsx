import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  NodeTypes,
  Connection as FlowConnection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Terminal } from '../Terminal';
import SensorNode from '../nodes/SensorNode';
import OutputNode from '../nodes/OutputNode';
import IfNode from '../nodes/IfNode';
import PortInterface from '../nodes/PortInterface';
import TemperatureSensor from '../nodes/TemperatureSensor';

const nodeTypes: NodeTypes = {
  sensor: SensorNode,
  temp_sensor: TemperatureSensor,
  output: OutputNode,
  if: IfNode,
  port_interface: PortInterface,
};

export const CanvasArea: React.FC<any> = ({
  shapes,
  connections,
  onShapesUpdate,
  onConnectionsUpdate,
  code,
  onCodeUpdate,
}) => {
  const [mode, setMode] = useState<"canvas" | "code" | "diagram">("canvas");
  const [isOverTrash, setIsOverTrash] = useState(false);
  const trashRef = useRef<HTMLDivElement>(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    nodeId: string | null;
  }>({ visible: false, x: 0, y: 0, nodeId: null });

  // Hide context menu on click elsewhere
  React.useEffect(() => {
    if (!contextMenu.visible) return;
    const handle = () => setContextMenu((c) => ({ ...c, visible: false }));
    window.addEventListener('click', handle);
    return () => window.removeEventListener('click', handle);
  }, [contextMenu.visible]);

  const nodes: Node[] = shapes.map((shape: { id: { toString: () => any; }; x: any; y: any; type: string; }) => ({
    id: shape.id.toString(),
    position: { x: shape.x, y: shape.y },
    data: {
      label:
        shape.type === 'sensor'
          ? "Temperature Sensor"
          : shape.type === 'output'
          ? "Display Output"
          : "if (x > 10)",
    },
    type: shape.type,
    draggable: true, // Ensure nodes are draggable
  }));

  const edges: Edge[] = connections.map((conn: { fromId: { toString: () => any; }; toId: { toString: () => any; }; }) => ({
    id: `e${conn.fromId}-${conn.toId}`,
    source: conn.fromId.toString(),
    target: conn.toId.toString(),
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#888', strokeWidth: 2 },
  }));

  const onNodeDragStop = useCallback(
    (_: any, node: Node) => {
      const id = parseInt(node.id);
      const updatedShapes = shapes.map((shape: { id: number; }) =>
        shape.id === id
          ? { ...shape, x: node.position.x, y: node.position.y }
          : shape
      );
      onShapesUpdate(updatedShapes);
    },
    [shapes, onShapesUpdate]
  );

  const onNodeDrag = useCallback(
    (_: any, node: Node) => {
      // Update node position in state for smooth dragging
      const id = parseInt(node.id);
      const updatedShapes = shapes.map((shape: { id: number; }) =>
        shape.id === id
          ? { ...shape, x: node.position.x, y: node.position.y }
          : shape
      );
      onShapesUpdate(updatedShapes);

      // Trash can highlight logic
      if (trashRef.current) {
        const trashRect = trashRef.current.getBoundingClientRect();
        // Use node absolute position (screen coordinates)
        // node.position is in flow coordinates, so we need to get the DOM node position
        // For simplicity, use mouse position if available (not perfect, but works for most cases)
        // You can improve this by using event.clientX/clientY if available
        // Here, we just check if the node's center is over the trash
        const nodeCenterX = node.position.x;
        const nodeCenterY = node.position.y;
        // Get the bounding rect of the ReactFlow container
        const flowContainer = trashRef.current.closest('.react-flow');
        let offsetX = 0, offsetY = 0;
        if (flowContainer) {
          const flowRect = flowContainer.getBoundingClientRect();
          offsetX = flowRect.left;
          offsetY = flowRect.top;
        }
        const absX = nodeCenterX + offsetX;
        const absY = nodeCenterY + offsetY;
        const isOver =
          absX >= trashRect.left &&
          absX <= trashRect.right &&
          absY >= trashRect.top &&
          absY <= trashRect.bottom;
        setIsOverTrash(isOver);
      }
    },
    [shapes, onShapesUpdate]
  );

  const onNodeDragEnd = useCallback(
    (_: any, node: Node) => {
      if (isOverTrash && trashRef.current) {
        // Remove the node
        const id = parseInt(node.id);
        const updatedShapes = shapes.filter((shape: { id: number; }) => shape.id !== id);
        // Remove associated connections
        const updatedConnections = connections.filter(
          (conn: { fromId: number; toId: number; }) =>
            conn.fromId !== id && conn.toId !== id
        );
        onShapesUpdate(updatedShapes);
        onConnectionsUpdate(updatedConnections);
      }
      setIsOverTrash(false);
    },
    [shapes, connections, onShapesUpdate, onConnectionsUpdate, isOverTrash]
  );

  const onConnect = useCallback(
    (connection: FlowConnection) => {
      if (!connection.source || !connection.target) return;
      const newConnection = {
        fromId: parseInt(connection.source),
        toId: parseInt(connection.target),
      };
      onConnectionsUpdate([...connections, newConnection]);
    },
    [connections, onConnectionsUpdate]
  );

  // Context menu handler for node right-click
  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id,
    });
  }, []);

  // Delete node and its edges
  const handleDeleteNode = useCallback(() => {
    if (!contextMenu.nodeId) return;
    const id = parseInt(contextMenu.nodeId);
    const updatedShapes = shapes.filter((shape: { id: number; }) => shape.id !== id);
    const updatedConnections = connections.filter(
      (conn: { fromId: number; toId: number; }) =>
        conn.fromId !== id && conn.toId !== id
    );
    onShapesUpdate(updatedShapes);
    onConnectionsUpdate(updatedConnections);
    setContextMenu({ ...contextMenu, visible: false });
  }, [contextMenu, shapes, connections, onShapesUpdate, onConnectionsUpdate]);

  const renderModeSwitcher = () => (
    <div className="absolute top-0 right-0 z-10 flex flex-col space-y-2 p-2">
      <button
        className={`px-3 py-1 rounded ${mode === "canvas" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
        onClick={() => setMode("canvas")}
      >
        Canvas
      </button>
      <button
        className={`px-3 py-1 rounded ${mode === "code" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
        onClick={() => setMode("code")}
      >
        Code
      </button>
      <button
        className={`px-3 py-1 rounded ${mode === "diagram" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
        onClick={() => setMode("diagram")}
      >
        Diagram
      </button>
    </div>
  );

  const renderContent = () => {
    switch (mode) {
      case "canvas":
        return (
          <div className="relative w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodeDragStop={onNodeDragStop}
              onNodeDrag={onNodeDrag}
              onConnect={onConnect}
              fitView
              onNodeContextMenu={onNodeContextMenu}
            >
              <MiniMap nodeColor={(node) => {
                if (node.type === 'sensor') return '#0A0';
                if (node.type === 'output') return '#007acc';
                if (node.type === 'if') return '#ffcc00';
                return '#eee';
              }} />
              <Controls />
              <Background />
            </ReactFlow>
            {contextMenu.visible && (
              <div
                style={{
                  position: 'fixed',
                  top: contextMenu.y,
                  left: contextMenu.x,
                  zIndex: 1000,
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  minWidth: 120,
                }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                  onClick={handleDeleteNode}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      case "code":
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <textarea
              className="bg-black text-green-400 p-4 rounded w-11/12 h-[80vh] resize-none focus:outline-none"
              value={code}
              onChange={(e) => onCodeUpdate(e.target.value)}
            />
          </div>
        );
      case "diagram":
        return (
          <div className="w-full h-full flex items-center justify-center bg-white">
            <p className="text-gray-500 text-xl">Diagram mode - No idea what this is :/</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ReactFlowProvider>
      <div className="w-full h-full relative">
        {renderModeSwitcher()}
        {renderContent()}
        <Terminal />
      </div>
    </ReactFlowProvider>
  );
};