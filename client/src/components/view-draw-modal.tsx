import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDraw } from "@/providers/draw-provider";
function ViewDrawModal({ url }: { url: string }) {
  const { previewUrl, setPreviewUrl } = useDraw();
  return (
    <Dialog open={Boolean(previewUrl)} onOpenChange={() => setPreviewUrl(null)}>
      <DialogContent>
        <img src={url} />
      </DialogContent>
    </Dialog>
  );
}

export default ViewDrawModal;
