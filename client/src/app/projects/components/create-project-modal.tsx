import { z } from "zod";
import toast from "react-hot-toast";
import { axiosIns } from "@/lib/axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/app/projects/[projectId]/components/modal";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CreateProjectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  onSuccess,
}) => {
  const formSchema = z.object({
    name: z.string().min(1),
  });

  type FormType = z.infer<typeof formSchema>;

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await axiosIns.post("/api/projects/create", { name });
      return res.data;
    },
  });

  const form = useForm<FormType>({
    defaultValues: { name: "" },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: FormType) => {
    createMutation.mutate(values.name, {
      onSuccess: (data) => {
        toast.success(data.message);
        form.reset();
        onSuccess?.();
      },
      onError: (err: any) => {
        console.error(err);
        toast.error(
          err.response.data.error || err.message || "Something bad happened"
        );
      },
    });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
      }}
      title="Create Project"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name of your Project"
                    disabled={createMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-3 justify-end">
            <Button
              type="button"
              disabled={createMutation.isPending}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="self-end"
            >
              Create
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
