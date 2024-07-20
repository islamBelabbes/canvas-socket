import { useDraw } from "@/providers/draw-provider";
import { useEffect, useState } from "react";

function EraserCursor() {
  const [positions, setPositions] = useState<[number, number]>([0, 0]);
  const { tool, isOnBoard, canvasRef } = useDraw();

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setPositions([e.clientX, e.clientY]);
    };

    if (tool === "eraser") {
      window.addEventListener("mousemove", handle);
    }

    return () => window.removeEventListener("mousemove", handle);
  }, [tool]);

  // hide cursor

  useEffect(() => {
    if (canvasRef.current && tool === "eraser") {
      canvasRef.current.style.cursor = "none";
    }

    return () => {
      if (canvasRef.current) canvasRef.current.style.cursor = "auto";
    };
  }, [canvasRef, tool]);

  if (tool !== "eraser" || !isOnBoard) return null;
  return (
    <div
      className="absolute inset-0 bg-red-500 rounded-full w-[50px] h-[50px]"
      style={{
        transform: `translate(${positions[0] - 20}px, ${positions[1] - 20}px)`,
        pointerEvents: "none",
      }}
    />
  );
}

export default EraserCursor;
