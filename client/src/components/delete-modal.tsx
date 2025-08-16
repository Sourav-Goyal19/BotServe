import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { CookingPot } from "lucide-react";

interface ModalProps {
  data: any;
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  isLoading?: boolean;
  onDelete: (data: any) => void;
}

export const DeleteModal: React.FC<ModalProps> = ({
  data,
  title,
  isOpen,
  onClose,
  isLoading,
  onDelete,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-3">
          <div className="w-fit bg-destructive rounded-full p-2 h-fit">
            <CookingPot className="size-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-lg font-medium">Delete {title}</p>
            <p className="text-sm mt-1 text-accent-foreground">
              Are you sure you want to delete this {title}?
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 justify-end">
          <Button variant="outline" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={() => onDelete(data)}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
