import React, { useRef, useEffect } from "react";

interface Shape {
  type: string;
  x: number;
  y: number;
}

interface CanvasAreaProps {
  shapes: Shape[];
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({ shapes }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each shape
    shapes.forEach((shape) => {
      switch (shape.type) {
        case "circle":
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, 30, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
          break;
        case "rectangle":
          ctx.fillStyle = "blue";
          ctx.fillRect(shape.x - 30, shape.y - 30, 60, 60);
          break;
        default:
          break;
      }
    });
  }, [shapes]);

  // Optional: handle clicking on the canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // E.g. if you want to add or update shapes on canvas click
    // console.log("Canvas clicked", e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      width={800}
      height={600}
      className="border border-gray-300 w-full h-full"
    />
  );
};
