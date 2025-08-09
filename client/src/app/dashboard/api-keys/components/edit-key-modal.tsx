import { z } from "zod";
import { useForm } from "react-hook-form";
import type { ApiKeyType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Modal } from "../../components/modal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const editKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
  isActive: z.boolean(),
});

type FormType = z.infer<typeof editKeySchema>;

interface EditKeyModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  apiKey: ApiKeyType;
  onUpdate: (data: FormType) => void;
  isLoading: boolean;
}

export const EditKeyModal: React.FC<EditKeyModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  apiKey,
  onUpdate,
  isLoading,
}) => {
  const form = useForm<FormType>({
    resolver: zodResolver(editKeySchema),
    defaultValues: {
      name: apiKey.name,
      isActive: apiKey.isActive,
    },
  });

  const onSubmit = (values: FormType) => {
    onUpdate(values);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Edit API Key"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Name</FormLabel>
                <FormControl>
                  <Input placeholder="My API Key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Active</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    {field.value
                      ? "This key is currently active"
                      : "This key is currently inactive"}
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
