import { z } from "zod";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { axiosIns } from "@/lib/axios";
import { useForm } from "react-hook-form";
import type { ProjectType } from "@/types";
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

interface EditProjectModalProps {
  isModalOpen: boolean;
  onSuccess?: () => void;
  project: ProjectType | null;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  project,
  onSuccess,
}) => {
  const formSchema = z.object({
    name: z.string().min(1),
  });

  type FormType = z.infer<typeof formSchema>;

  const editMutation = useMutation({
    mutationFn: async (values: { id: string; name: string }) => {
      const res = await axiosIns.patch(`/api/projects/${values.id}`, {
        name: values.name,
      });
      return res.data;
    },
  });

  const form = useForm<FormType>({
    defaultValues: { name: project?.name || "" },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (project) {
      form.reset({ name: project.name });
    }
  }, [project, form]);

  const onSubmit = (values: FormType) => {
    if (!project) return;

    editMutation.mutate(
      { id: project.id, name: values.name },
      {
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
      }
    );
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        form.reset();
      }}
      title="Edit Project"
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
                    disabled={editMutation.isPending}
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
              disabled={editMutation.isPending}
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={editMutation.isPending}
              className="self-end"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
