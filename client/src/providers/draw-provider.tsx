import { dataURLtoBlob } from "@/lib/utils";
import { TTool } from "@/types/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type THandleDraw = {
  e?: React.MouseEvent<HTMLCanvasElement, MouseEvent>;
  onDraw?: (params: {
    previousPoint: TPoint;
    currentPoint: TPoint;
    color: string;
  }) => void;
  previousPoint?: TPoint;
  currentPoint?: TPoint;
  drawingColor?: string;
};

type TDrawContext = {
  handleDraw: (param: THandleDraw) => void;
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  canvasContext: CanvasRenderingContext2D | null;
  isDrawing: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  tool: TTool | null;
  setTool: (
    tool: TTool | null | ((prev: TTool | null) => TTool | null)
  ) => void;
  color: string;
  setColor: (color: string) => void;
  clear: ({ onClear }: { onClear?: () => void }) => void;
  handleEraser: (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  isOnBoard: boolean;
  setIsOnBoard: (isOnBoard: boolean) => void;
  download: () => void;
  view: () => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
};

type TPoint = { x: number; y: number };

const drawContext = createContext<TDrawContext | null>(null);

export const useDraw = () => {
  const context = useContext(drawContext);
  if (context === null) {
    throw new Error("useDraw must be used within a DrawProvider");
  }
  return context;
};

export const DrawProvider = ({ children }: { children: React.ReactNode }) => {
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<TTool | null>(null);
  const [color, setColor] = useState<string>("#000");
  const [isOnBoard, setIsOnBoard] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<TPoint | null>(null);

  const getPointsBasedOnCanvas = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    return { x, y };
  };

  const handleDraw = useCallback(
    ({ e, onDraw, currentPoint, previousPoint, drawingColor }: THandleDraw) => {
      if (!canvasContext || (!isDrawing && !currentPoint)) return;

      const points = e ? getPointsBasedOnCanvas(e) : currentPoint;
      if (!points) return;

      const { x: currX, y: currY } = points;

      const lineColor = drawingColor || color;
      const lineWidth = 5;

      let startPoint = previousPoint || prevPoint.current || points;
      canvasContext.beginPath();
      canvasContext.lineWidth = lineWidth;
      canvasContext.strokeStyle = lineColor;
      canvasContext.moveTo(startPoint.x, startPoint.y);
      canvasContext.lineTo(currX, currY);
      canvasContext.stroke();

      canvasContext.fillStyle = lineColor;
      canvasContext.beginPath();
      canvasContext.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
      canvasContext.fill();

      if (!currentPoint) {
        prevPoint.current = points;
      }

      return onDraw?.({
        previousPoint: startPoint,
        currentPoint: points,
        color: lineColor,
      });
    },
    [canvasContext, color, isDrawing, prevPoint, tool]
  );

  const handleMouseUp = () => {
    setIsDrawing(false);
    prevPoint.current = null;
  };

  const handleMouseDown = () => setIsDrawing(true);

  const handleEraser = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvasContext || !canvasRef.current || !isDrawing) return;

    const points = getPointsBasedOnCanvas(e);
    if (!points) return;

    canvasContext.save(); // Save the current canvas state
    canvasContext.globalCompositeOperation = "destination-out"; // Set eraser mode

    // Draw a circle for erasing
    canvasContext.beginPath();
    canvasContext.arc(points.x, points.y, 45, 0, Math.PI * 2); // 45 is half of 90
    canvasContext.fill();

    canvasContext.restore(); // Restore the canvas state to its original
  };

  // ACTIONS
  const clear = ({ onClear }: { onClear?: () => void } = {}) => {
    if (!canvasContext || !canvasRef.current) return;
    canvasContext.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    prevPoint.current = null;
    onClear?.();
  };

  const view = () => {
    if (!canvasContext) return;

    // Convert data URL to Blob
    const dataUrl = canvasContext.canvas.toDataURL("image/png");
    const blob = dataURLtoBlob(dataUrl);

    // Create a File object from Blob
    const file = new File([blob], "canvas.png", { type: "image/png" });

    // Set preview URL
    setPreviewUrl(URL.createObjectURL(file));
  };

  const download = () => {
    if (!canvasContext || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "canvas.png";
    link.href = dataURL;
    link.click();
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };

  // initials canvas
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      setCanvasContext(ctx);
    }

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasRef.current]);

  const value = {
    handleDraw,
    handleMouseDown,
    handleMouseUp,
    canvasContext,
    isDrawing,
    canvasRef,
    tool,
    setTool,
    color,
    setColor,
    clear,
    handleEraser,
    isOnBoard,
    setIsOnBoard,
    download,
    view,
    previewUrl,
    setPreviewUrl,
  };
  return <drawContext.Provider value={value}>{children}</drawContext.Provider>;
};
