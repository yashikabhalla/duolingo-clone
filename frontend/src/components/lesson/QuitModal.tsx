import Button from "@/components/ui/Button";
import Mascot from "@/components/ui/Mascot";
import Modal from "@/components/ui/Modal";

interface QuitModalProps {
  open: boolean;
  onKeepLearning: () => void;
  onQuit: () => void;
}

export default function QuitModal({ open, onKeepLearning, onQuit }: QuitModalProps) {
  return (
    <Modal open={open} onClose={onKeepLearning}>
      <div className="flex flex-col items-center gap-3">
        <Mascot size={110} />
        <h2 className="text-2xl font-extrabold">Wait, don&apos;t go!</h2>
        <p className="font-bold text-wolf">You&apos;ll lose your progress in this lesson if you quit now.</p>
        <div className="mt-2 flex w-full flex-col gap-3">
          <Button fullWidth onClick={onKeepLearning}>
            Keep learning
          </Button>
          <Button fullWidth variant="danger-outline" onClick={onQuit}>
            End session
          </Button>
        </div>
      </div>
    </Modal>
  );
}