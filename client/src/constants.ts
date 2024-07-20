import {
  PencilIcon,
  DownloadIcon,
  EyeIcon,
  TrashIcon,
  Palette,
  Eraser,
} from "lucide-react";

export const TOOLS = [
  {
    Icon: EyeIcon,
    id: "eye",
    isAction: true,
  },
  {
    Icon: DownloadIcon,
    id: "download",
    isAction: true,
  },
  {
    Icon: TrashIcon,
    id: "trash",
    isAction: true,
  },
  {
    Icon: Palette,
    id: "palette",
    isAction: false,
  },
  {
    Icon: Eraser,
    id: "eraser",
    isAction: false,
  },
] as const;
