import Button from "@/components/ui/Button";
import Mascot from "@/components/ui/Mascot";
import Modal from "@/components/ui/Modal";

// Mirrors REFILL_COST_GEMS in backend/app/services/hearts.py
export const REFILL_COST_GEMS = 350;

interface OutOfHeartsModalProps {
  open: boolean;
  gems: number;
  refilling: boolean;
  onRefill: () => void;
  onPractice: () => void;
  onQuit: () => void;
}

/** Shown when the last heart is lost (or when you open a lesson with 0 hearts). Cannot be dismissed. */
export default function OutOfHeartsModal({ open, gems, refilling, onRefill, onPractice, onQuit }: OutOfHeartsModalProps) {
  const canAfford = gems >= REFILL_COST_GEMS;

  return (
    <Modal open={open} dismissible={false}>
      <div className="flex flex-col items-center gap-3">
        <Mascot size={110} />
        <h2 className="text-2xl font-extrabold">You ran out of hearts!</h2>
        <p className="font-bold text-wolf">Refill your hearts to keep going, or come back when they regenerate.</p>
        <div className="mt-2 flex w-full flex-col gap-3">
          <Button variant="blue" fullWidth disabled={!canAfford || refilling} onClick={onRefill}>
            Refill hearts · 💎 {REFILL_COST_GEMS}
          </Button>
          {!canAfford && <p className="text-sm font-bold text-cardinal">Not enough gems (you have {gems}).</p>}
          <Button variant="secondary" fullWidth onClick={onPractice}>
            Practice to earn hearts
          </Button>
          <Button variant="danger-outline" fullWidth onClick={onQuit}>
            No thanks
          </Button>
        </div>
      </div>
    </Modal>
  );
}