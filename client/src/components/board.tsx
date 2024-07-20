import socket from "@/lib/socket-io";
import { useDraw } from "@/providers/draw-provider";
import { useEffect } from "react";

export default function Board() {
  const {
    handleDraw,
    handleMouseDown,
    canvasRef,
    tool,
    handleEraser,
    setIsOnBoard,
    canvasContext,
    clear,
  } = useDraw();

  const handleOnMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (tool === "eraser") return handleEraser(e);

    handleDraw({
      e,
      onDraw: ({ currentPoint, previousPoint, color }) => {
        return socket.emit("draw", { currentPoint, previousPoint, color });
      },
    });
  };

  useEffect(() => {
    socket.on("draw", (currentPoint, previousPoint, color) => {
      return handleDraw({
        previousPoint,
        currentPoint,
        drawingColor: color,
      });
    });

    return () => {
      socket.off("draw");
    };
  }, [handleDraw]);

  useEffect(() => {
    socket.emit("joined");

    socket.on("joined", () => {
      if (!canvasContext) return;
      socket.emit("sync", canvasContext.canvas.toDataURL());
    });

    socket.on("sync", (data) => {
      if (!canvasContext) return;
      const img = new Image();
      img.src = data;
      canvasContext.drawImage(img, 0, 0);
    });

    socket.on("board-cleared", () => {
      clear({});
    });

    return () => {
      socket.off("joined");
      socket.off("sync");
      socket.off("board-cleared");
    };
  }, [canvasContext]);
  return (
    <canvas
      className="border rounded-md border-accent"
      onMouseDown={handleMouseDown}
      onMouseMove={handleOnMouseMove}
      onMouseEnter={() => setIsOnBoard(true)}
      onMouseLeave={() => setIsOnBoard(false)}
      ref={canvasRef}
      width={1200}
      height={600}
    >
      Sorry your browser does not support the canvas element.
    </canvas>
  );
}
