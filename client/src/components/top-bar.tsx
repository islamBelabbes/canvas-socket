import { TOOLS } from "@/constants";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useDraw } from "@/providers/draw-provider";
import { HexColorPicker } from "react-colorful";
import { TTool } from "@/types/types";
import { useRef } from "react";
import ViewDrawModal from "./view-draw-modal";
import socket from "@/lib/socket-io";

function TopBar() {
  const { tool, setTool, color, setColor, clear, download, view, previewUrl } =
    useDraw();
  const tools = TOOLS.filter((tool) => !tool.isAction); // no need to useMemo its a small array
  const actions = TOOLS.filter((tool) => tool.isAction); // no need to useMemo its a small array
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (Tool: TTool) => {
    if (tool === Tool) return setTool(null);
    setTool(Tool);
  };

  const handleOnblur = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      timeout.current && clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setTool((prev) => (prev === "palette" ? null : prev));
      }, 100);
    }
  };

  const handleAction = (action: (typeof actions)[number]["id"]) => {
    switch (action) {
      case "trash": {
        return clear({
          onClear: () => {
            socket.emit("board-cleared");
          },
        });
      }
      case "download": {
        return download();
      }
      case "eye": {
        return view();
      }
      default:
        throw new Error("Unknown action");
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
      <div className="relative flex items-center gap-2">
        {tools.map((Tool) => (
          <Button
            variant="ghost"
            className={cn("", {
              "bg-accent": Tool.id === tool,
            })}
            size="icon"
            key={Tool.id}
            onClick={() => handleClick(Tool.id)}
          >
            <Tool.Icon
              className="w-5 h-5"
              style={{
                color: Tool.id === "palette" ? color : "",
              }}
            />
          </Button>
        ))}

        {tool === "palette" && (
          <button
            autoFocus
            onBlur={handleOnblur}
            className="!absolute inset-0 top-10 left-[50px] z-10"
          >
            <HexColorPicker color={color} onChange={setColor} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions.map((Tool) => (
          <Button
            variant="ghost"
            size="icon"
            key={Tool.id}
            onClick={() => handleAction(Tool.id)}
          >
            <Tool.Icon className="w-5 h-5" />
          </Button>
        ))}
      </div>

      {previewUrl && <ViewDrawModal url={previewUrl} />}
    </div>
  );
}

export default TopBar;
