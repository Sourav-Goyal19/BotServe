import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { TriangleAlert } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  isLoading?: boolean;
  onDelete: (data: any) => void;
  data: any;
}

export const DeleteModal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  isLoading,
  onDelete,
  data,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-3">
          <div className="w-fit bg-destructive rounded-full p-2 h-fit">
            <TriangleAlert className="size-6 text-primary-foreground" />
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
