"use client";

import { Separator } from "@/components/ui/separator";
import { useAdminBlogLists } from "@/hooks/useAdminBlogLists";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import AdminStats from "./AdminStats";
import AdminPostTable from "./AdminPostTable";

export default function AdminMain() {
  const { data: session } = useSession();
  const { data, isLoading } = useAdminBlogLists();

  if (!session?.user?.isAdmin) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        Access denied. Admin only.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your blog settings and content.
        </p>
      </div>

      {data?.stats && <AdminStats stats={data.stats} />}

      <Separator />

      <div>
        <h2 className="text-xl font-semibold mb-4">All Posts</h2>
        {data?.posts && <AdminPostTable posts={data.posts} />}
      </div>
    </div>
  );
}
