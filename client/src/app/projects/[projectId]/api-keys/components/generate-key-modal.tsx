import { Copy } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useMutation } from "@tanstack/react-query";
import { axiosIns } from "@/lib/axios";
import toast from "react-hot-toast";
import { Modal } from "../../components/modal";
import { Button } from "@/components/ui/button";

interface GenerateKeyModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}

export const GenerateKeyModal: React.FC<GenerateKeyModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  onSuccess,
}) => {
  const [generatedApiKey, setGeneratedApiKey] = useState("");
  const [isKeyGenerated, setIsKeyGenerated] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
  });

  type FormType = z.infer<typeof formSchema>;

  const form = useForm<FormType>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(formSchema),
  });

  const generateApiMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await axiosIns.post("/api/keys/generate", { name });
      return res;
    },
  });

  const onSubmit = (values: FormType) => {
    generateApiMutation.mutate(values.name, {
      onSuccess(res) {
        setGeneratedApiKey(res.data.apiKey);
        setIsKeyGenerated(true);
        form.reset();
        onSuccess?.();
      },
      onError(err: any) {
        toast.error(
          err?.response?.data?.error || err?.message || "Something went wrong."
        );
        setIsKeyGenerated(false);
        setGeneratedApiKey("");
      },
    });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setIsKeyGenerated(false);
        setGeneratedApiKey("");
      }}
      title="Generate API Key"
    >
      <div className="overflow-hidden">
        {isKeyGenerated ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 max-w-full">
              <p className="bg-card border p-2 overflow-x-auto rounded-md w-full text-nowrap font-mono">
                {generatedApiKey}
              </p>
              <Button
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(generatedApiKey);
                  toast.success("API key copied to clipboard");
                }}
              >
                <Copy className="size-4" />
              </Button>
            </div>
            <p className="text-sm text-destructive mt-2">
              Please save this API key somewhere safe and accessible. For
              security reasons, you won't be able to view it again through your
              account. If you lose this API key, you'll need to generate a new
              one.
            </p>
            {/* <div className="self-end">
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </div> */}
          </div>
        ) : (
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={generateApiMutation.isPending}
                        placeholder="Name of the API key"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={generateApiMutation.isPending}
                >
                  Cancel
                </Button>
                <Button disabled={generateApiMutation.isPending} type="submit">
                  {generateApiMutation.isPending
                    ? "Creating...."
                    : "Create API Key"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </Modal>
  );
};
