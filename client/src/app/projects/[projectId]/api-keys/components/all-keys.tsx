import { format } from "date-fns";
import {
  type QueryObserverResult,
  type RefetchOptions,
} from "@tanstack/react-query";
import { Trash2, Edit, Clock, Check, X } from "lucide-react";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ApiKeyType } from "@/types";

interface AllKeysProps {
  apiKeys: ApiKeyType[] | undefined;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<ApiKeyType[], Error>>;
  setSelectedKey: React.Dispatch<React.SetStateAction<ApiKeyType | null>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AllKeys: React.FC<AllKeysProps> = ({
  apiKeys,
  setSelectedKey,
  setIsEditModalOpen,
  isLoading,
  setIsDeleteModalOpen,
}) => {
  const handleEdit = (key: ApiKeyType) => {
    setSelectedKey(key);
    setIsEditModalOpen(true);
  };

  const handleDelete = (key: ApiKeyType) => {
    setSelectedKey(key);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8}>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </TableCell>
            </TableRow>
          ) : apiKeys?.length ? (
            apiKeys.map((key) => (
              <TableRow key={key.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {key.name}
                    {key.isActive === false && (
                      <Badge variant="outline" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {key.isActive ? (
                    <Badge variant="default">
                      <Check className="size-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <X className="size-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {key.key.substring(0, 8)}...
                  </Badge>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      {key.createdAt &&
                        format(new Date(key.createdAt), "MMM dd, yyyy")}
                    </TooltipTrigger>
                    <TooltipContent>
                      {key.createdAt && format(new Date(key.createdAt), "PPpp")}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {key.expiresAt ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {format(new Date(key.expiresAt), "MMM dd, yyyy")}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {format(new Date(key.expiresAt), "PPpp")}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    "Never"
                  )}
                </TableCell>
                <TableCell>
                  {key.lastUsed ? (
                    <Tooltip>
                      <TooltipTrigger>
                        {format(new Date(key.lastUsed), "MMM dd, yyyy")}
                      </TooltipTrigger>
                      <TooltipContent>
                        {format(new Date(key.lastUsed), "PPpp")}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    "Never"
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{key.usageCount}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(key)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isLoading}
                      onClick={() => handleDelete(key)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <p className="text-muted-foreground">
                  No API keys found. Generate one to get started.
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
