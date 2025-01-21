import React, { useRef, useEffect, useState } from "react";

interface Shape {
  id: number;
  type: string;
  x: number;
  y: number;
}

interface Connection {
  fromId: number;
  toId: number;
}

interface CanvasAreaProps {
  shapes: Shape[];
  connections: Connection[];
  onShapesUpdate: (updated: Shape[]) => void;
  onConnectionsUpdate: (updated: Connection[]) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  shapes,
  connections,
  onShapesUpdate,
  onConnectionsUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [draggingShape, setDraggingShape] = useState<{
    shapeId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [connectingFrom, setConnectingFrom] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rita befintliga kopplingar
    connections.forEach(({ fromId, toId }) => {
      const fromShape = shapes.find((s) => s.id === fromId);
      const toShape = shapes.find((s) => s.id === toId);
      if (fromShape && toShape) {
        ctx.beginPath();
        ctx.moveTo(fromShape.x, fromShape.y);
        ctx.lineTo(toShape.x, toShape.y);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Rita shapes + handles
    shapes.forEach((shape) => {
      if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, 30, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      } else {
        ctx.fillStyle = "blue";
        ctx.fillRect(shape.x - 30, shape.y - 30, 60, 60);
      }

      // Rita litet grönt "handle" till höger om formen
      const handleX = shape.x + 35;
      const handleY = shape.y;
      ctx.beginPath();
      ctx.arc(handleX, handleY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "green";
      ctx.fill();
    });

    // Rita temporär linje om vi "drar" en koppling
    if (connectingFrom !== null && mousePos) {
      const fromShape = shapes.find((s) => s.id === connectingFrom);
      if (fromShape) {
        ctx.beginPath();
        ctx.moveTo(fromShape.x + 35, fromShape.y); 
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.strokeStyle = "gray";
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [shapes, connections, connectingFrom, mousePos]);

  // Automatically resize the canvas to fill the window
  useEffect(() => {
    function handleResize() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Match the displayed size (CSS) with internal drawing size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Redraw your shapes or whatever you need here:
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapes.forEach((shape) => {
        // Just draw a simple circle as example
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      });
    }

    // Trigger once on mount
    handleResize();

    // Also trigger on every browser resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [shapes]);

  // Returnerar shape + info om man klickade på "handle" eller ej
  const getClickedShapeOrHandle = (x: number, y: number) => {
    // Kolla handle först
    for (let shape of shapes) {
      const handleX = shape.x + 35;
      const handleY = shape.y;
      const distHandle = Math.sqrt((x - handleX) ** 2 + (y - handleY) ** 2);
      if (distHandle <= 5) {
        return { shape, isHandle: true };
      }
    }
    // Kolla shape
    for (let shape of shapes) {
      if (shape.type === "circle") {
        const dist = Math.sqrt((x - shape.x) ** 2 + (y - shape.y) ** 2);
        if (dist <= 30) return { shape, isHandle: false };
      } else {
        if (x >= shape.x - 30 && x <= shape.x + 30 &&
            y >= shape.y - 30 && y <= shape.y + 30) {
          return { shape, isHandle: false };
        }
      }
    }
    return null;
  };

  // Fångar klick på canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = getClickedShapeOrHandle(x, y);
    if (clicked) {
      if (clicked.isHandle) {
        // Starta koppling
        setConnectingFrom(clicked.shape.id);
      } else {
        // Börja dra en shape
        const offsetX = x - clicked.shape.x;
        const offsetY = y - clicked.shape.y;
        setDraggingShape({ shapeId: clicked.shape.id, offsetX, offsetY });
      }
    }
  };

  // Fångar musdrag
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    if (draggingShape) {
      const { shapeId, offsetX, offsetY } = draggingShape;
      // Uppdatera position för shape
      const updated = shapes.map((s) =>
        s.id === shapeId ? { ...s, x: x - offsetX, y: y - offsetY } : s
      );
      onShapesUpdate(updated);
    }
  };

  // Släpper musknappen
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Om vi släpper när vi håller på att koppla
    if (connectingFrom !== null) {
      const target = getClickedShapeOrHandle(x, y);
      if (target && !target.isHandle) {
        // Skapa koppling
        const fromId = connectingFrom;
        const toId = target.shape.id;
        if (fromId !== toId) {
          onConnectionsUpdate([...connections, { fromId, toId }]);
        }
      }
      setConnectingFrom(null);
    }

    // Avsluta drag
    setDraggingShape(null);
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100vw", height: "100vh" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};
