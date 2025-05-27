import React, { useCallback, useState } from 'react';
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

  const xpath = '/html/body/div/div/div[2]/main/div/div/div/div/div[4]';
  const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  const nodeFound = result.singleNodeValue;
  if (nodeFound && nodeFound.parentNode) {
    nodeFound.parentNode.removeChild(nodeFound);
  }

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
    switch(mode) {
      case "canvas":
        return (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeDragStop={onNodeDragStop}
            onConnect={onConnect}
            fitView
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