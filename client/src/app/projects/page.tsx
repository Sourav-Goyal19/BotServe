import { useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { axiosIns } from "@/lib/axios";
import type { ProjectType } from "@/types";
import { Button } from "@/components/ui/button";
import { AllProjects } from "./components/all-projects";
import { DeleteModal } from "@/components/delete-modal";
import { Heading } from "./[projectId]/components/heading";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EditProjectModal } from "./components/edit-project-modal";
import { CreateProjectModal } from "./components/create-project-modal";

const ProjectsPage = () => {
  const {
    data: projects,
    isLoading,
    refetch,
  } = useQuery<ProjectType[]>({
    queryKey: ["all-projects"],
    queryFn: async () => {
      const res = await axiosIns.get("/api/projects/all");
      return res.data.projects;
    },
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectType | null>(
    null
  );

  const handleEditProject = (project: ProjectType) => {
    setCurrentProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = (project: ProjectType) => {
    setCurrentProject(project);
    setIsDeleteModalOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const res = await axiosIns.delete(`/api/projects/${projectId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Project deleted successfully");
      setIsDeleteModalOpen(false);
      refetch();
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.error || err.message || "Failed to delete project"
      );
    },
  });

  return (
    <div className="container px-5 py-7">
      <Heading title="Projects" subheading="Manage your projects here">
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="-ms-1 opacity-60" size={16} aria-hidden={true} />
          New
        </Button>
      </Heading>

      <CreateProjectModal
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refetch();
        }}
      />

      <AllProjects
        projects={projects}
        isLoading={isLoading}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
      />

      <EditProjectModal
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        project={currentProject}
        onSuccess={() => {
          setIsEditModalOpen(false);
          refetch();
        }}
      />

      <DeleteModal
        title="project"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        data={currentProject}
        isLoading={deleteMutation.isPending}
        onDelete={(project: ProjectType) => deleteMutation.mutate(project.id)}
      />
    </div>
  );
};
export default ProjectsPage;
