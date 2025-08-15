import { useState } from "react";
import { Plus } from "lucide-react";
import { axiosIns } from "@/lib/axios";
import { toast } from "react-hot-toast";
import type { ApiKeyType } from "@/types";
import { Heading } from "../components/heading";
import { Button } from "@/components/ui/button";
import { AllKeys } from "./components/all-keys";
import { EditKeyModal } from "./components/edit-key-modal";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GenerateKeyModal } from "./components/generate-key-modal";
import { DeleteModal } from "@/components/delete-modal";

const ApiKeys = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKeyType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    data: apiKeys,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const res = await axiosIns.get("/api/keys/all");
      return res.data.apiKeys as ApiKeyType[];
    },
  });

  const updateKeyMutation = useMutation({
    mutationFn: async (data: {
      apiKey: string;
      name?: string;
      isActive?: boolean;
    }) => {
      await axiosIns.patch("/api/keys/update", data);
    },
    onSuccess: () => {
      toast.success("API key updated successfully");
      refetch();
      setIsEditModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.error || err?.message || "Failed to update API key"
      );
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (apiKey: string) => {
      await axiosIns.delete("/api/keys/revoke", { data: { apiKey } });
    },
    onSuccess: () => {
      toast.success("API key revoked successfully");
      refetch();
      setIsDeleteModalOpen(false);
      setSelectedKey(null);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.error || err?.message || "Failed to revoke API key"
      );
    },
  });

  return (
    <div className="space-y-6">
      <Heading
        title="API Keys"
        subheading="Your API keys to access your chatbots"
      >
        <Button onClick={() => setIsGenerateModalOpen(true)}>
          <Plus className="size-4 mr-1" />
          Generate New
        </Button>
      </Heading>

      <AllKeys
        apiKeys={apiKeys}
        refetch={refetch}
        isLoading={isLoading || updateKeyMutation.isPending}
        setSelectedKey={setSelectedKey}
        setIsEditModalOpen={setIsEditModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />

      <GenerateKeyModal
        isModalOpen={isGenerateModalOpen}
        setIsModalOpen={setIsGenerateModalOpen}
        onSuccess={refetch}
      />

      {isEditModalOpen && selectedKey && (
        <EditKeyModal
          key={selectedKey.id}
          isModalOpen={isEditModalOpen}
          setIsModalOpen={setIsEditModalOpen}
          apiKey={selectedKey}
          onUpdate={(data) =>
            updateKeyMutation.mutate({
              apiKey: selectedKey.key,
              ...data,
            })
          }
          isLoading={updateKeyMutation.isPending}
        />
      )}

      {isDeleteModalOpen && selectedKey && (
        <DeleteModal
          key={selectedKey.id}
          title={selectedKey.name}
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setSelectedKey(null);
            setIsDeleteModalOpen(false);
          }}
          data={selectedKey}
          isLoading={revokeMutation.isPending}
          onDelete={(key: ApiKeyType) => {
            revokeMutation.mutate(key.key);
          }}
        />
      )}
    </div>
  );
};

export default ApiKeys;
