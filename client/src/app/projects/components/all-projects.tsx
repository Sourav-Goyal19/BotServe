import { format } from "date-fns";
import { Link } from "react-router-dom";
import type { ProjectType } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";

interface AllProjectsProps {
  projects?: ProjectType[];
  isLoading?: boolean;
  onEditProject: (project: ProjectType) => void;
  onDeleteProject: (project: ProjectType) => void;
}

export const AllProjects: React.FC<AllProjectsProps> = ({
  projects,
  isLoading,
  onEditProject,
  onDeleteProject,
}) => {
  return (
    <div className="container mx-auto py-8">
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg bg-muted" />
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li key={project.id}>
              <div className="group relative">
                <Link
                  to={`/project/${project.id}`}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/50 transition-colors duration-150 border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors" />
                      <h2 className="text-base font-medium text-foreground truncate">
                        {project.name}
                      </h2>
                    </div>
                    <div className="flex gap-3 mt-1.5 ml-6">
                      {project.createdAt && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(project.createdAt), "dd MMM, yyyy")}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                        ID: {project.id.slice(0, 6)}...
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary ml-2 flex-shrink-0 transition-colors" />
                </Link>

                <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      onEditProject(project);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      onDeleteProject(project);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-6 rounded-lg border border-border text-center bg-background">
          <p className="text-foreground font-medium">No projects found</p>
          <p className="text-muted-foreground text-sm mt-1">
            Get started by creating your first project
          </p>
        </div>
      )}
    </div>
  );
};
