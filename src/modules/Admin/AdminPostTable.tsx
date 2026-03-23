"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TimeTransform } from "@/modules/common/TimeTransform";
import { useDeleteBlogMutation } from "@/hooks/useDeleteBlogMutation";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useState } from "react";

type Post = {
  id: number;
  title: string;
  views: number;
  privateYn: boolean;
  pinnedYn: boolean;
  deletedAt: string | null;
  createdAt: string;
  categoryId: number;
  category: { name: string } | null;
  _count: { comments: number };
};

export default function AdminPostTable({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const { mutate: deleteMutate } = useDeleteBlogMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const getStatus = (post: Post) => {
    if (post.deletedAt) return "Deleted";
    if (post.privateYn) return "Private";
    return "Published";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Deleted":
        return "destructive" as const;
      case "Private":
        return "secondary" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="py-3 pr-4 font-medium">Title</th>
            <th className="py-3 pr-4 font-medium hidden sm:table-cell">
              Category
            </th>
            <th className="py-3 pr-4 font-medium text-center">Views</th>
            <th className="py-3 pr-4 font-medium text-center hidden sm:table-cell">
              Comments
            </th>
            <th className="py-3 pr-4 font-medium">Status</th>
            <th className="py-3 pr-4 font-medium hidden md:table-cell">
              Date
            </th>
            <th className="py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => {
            const status = getStatus(post);
            return (
              <tr
                key={post.id}
                className="border-b border-border/50 hover:bg-accent/30 transition-colors"
              >
                <td className="py-3 pr-4">
                  <p className="font-medium line-clamp-1 max-w-[200px] sm:max-w-[300px]">
                    {post.title}
                  </p>
                </td>
                <td className="py-3 pr-4 text-muted-foreground hidden sm:table-cell">
                  {post.category?.name || "-"}
                </td>
                <td className="py-3 pr-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <Eye className="w-3.5 h-3.5" />
                    {post.views}
                  </div>
                </td>
                <td className="py-3 pr-4 text-center text-muted-foreground hidden sm:table-cell">
                  {post._count.comments}
                </td>
                <td className="py-3 pr-4">
                  <Badge variant={getStatusColor(status)}>{status}</Badge>
                </td>
                <td className="py-3 pr-4 text-muted-foreground text-xs hidden md:table-cell">
                  {TimeTransform(post.createdAt).date}
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => router.push(`/edit/${post.id}`)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    {!post.deletedAt && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (deletingId === post.id) {
                            deleteMutate(post.id);
                            setDeletingId(null);
                          } else {
                            setDeletingId(post.id);
                            setTimeout(() => setDeletingId(null), 3000);
                          }
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    {deletingId === post.id && (
                      <span className="text-xs text-destructive">
                        Click again
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
