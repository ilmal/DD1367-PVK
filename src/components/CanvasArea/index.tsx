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
import { Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { Terminal } from '../Terminal';

interface Shape {
  id: number;
  type: 'sensor' | 'output' | 'if';
  x: number;
  y: number;
}

interface CustomConnection {
  fromId: number;
  toId: number;
}

interface Props {
  shapes: Shape[];
  connections: CustomConnection[];
  onShapesUpdate: (updated: Shape[]) => void;
  onConnectionsUpdate: (updated: CustomConnection[]) => void;
  code: string;
  onCodeUpdate: (newCode: string) => void;
}

// Sensor node: a device with a left target and right source handle.
const SensorNode = ({ data }: any) => (
  <div style={{ border: '1px solid #444', borderRadius: '4px', backgroundColor: '#0A0', color: 'white', padding: '8px', fontFamily: 'monospace', minWidth: '120px' }}>
    <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Sensor</div>
    <div>{data.label || "Temperature Sensor"}</div>
    <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
  </div>
);

// Output node: a device with a left target and right source handle.
const OutputNode = ({ data }: any) => (
  <div style={{ border: '1px solid #444', borderRadius: '4px', backgroundColor: '#007acc', color: 'white', padding: '8px', fontFamily: 'monospace', minWidth: '120px' }}>
    <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Output</div>
    <div>{data.label || "Display Output"}</div>
    <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
  </div>
);

// If node: with one target handle on left and two source handles for true/false branches.
const IfNode = ({ data }: any) => (
  <div style={{ border: '1px solid #444', borderRadius: '4px', backgroundColor: '#ffcc00', color: '#333', padding: '8px', fontFamily: 'monospace', minWidth: '140px' }}>
    <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>If Condition</div>
    <div>{data.label || "if (x > 10)"}</div>
    <Handle type="source" position={Position.Right} id="true" style={{ top: '30%', background: '#555' }} />
    <Handle type="source" position={Position.Right} id="false" style={{ top: '70%', background: '#555' }} />
  </div>
);

const nodeTypes: NodeTypes = {
  sensor: SensorNode,
  output: OutputNode,
  if: IfNode,
};

export const CanvasArea: React.FC<Props> = ({
  shapes,
  connections,
  onShapesUpdate,
  onConnectionsUpdate,
  code,
  onCodeUpdate,
}) => {
  // Mode state: "canvas", "code", "diagram"
  const [mode, setMode] = useState<"canvas" | "code" | "diagram">("canvas");

  // Map shapes to ReactFlow nodes.
  const nodes: Node[] = shapes.map((shape) => ({
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

  // Map connections to edges.
  const edges: Edge[] = connections.map((conn) => ({
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
      const updatedShapes = shapes.map((shape) =>
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

  // Remove extra node if found (left unchanged)
  const xpath = '/html/body/div/div/div[2]/main/div/div/div/div/div[4]';
  const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  const nodeFound = result.singleNodeValue;
  if (nodeFound && nodeFound.parentNode) {
    nodeFound.parentNode.removeChild(nodeFound);
  }

  // Render the mode switcher in the top left corner of the canvas area.
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

  // Render content based on selected mode.
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
        {/* Add the terminal interface */}
        <Terminal />
      </div>
    </ReactFlowProvider>
  );
};
