"use client";

import { useAdjacentPosts } from "@/hooks/useAdjacentPosts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  blogId: number;
};

type AdjacentPost = {
  id: number;
  title: string;
  imageUrl: string;
} | null;

export default function PostNavigation({ blogId }: Props) {
  const { data } = useAdjacentPosts(blogId);
  const router = useRouter();

  if (!data) return null;

  const prev: AdjacentPost = data.prev;
  const next: AdjacentPost = data.next;

  if (!prev && !next) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-border">
      {prev ? (
        <button
          onClick={() => router.push(`/details/${prev.id}`)}
          className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-accent/50 transition-all text-left group cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Previous</p>
            <p className="text-sm font-medium text-foreground line-clamp-1">
              {prev.title}
            </p>
          </div>
          {prev.imageUrl && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
              <Image
                src={prev.imageUrl}
                alt=""
                fill
                className="object-cover"
                loader={({ src }) => src}
              />
            </div>
          )}
        </button>
      ) : (
        <div />
      )}

      {next ? (
        <button
          onClick={() => router.push(`/details/${next.id}`)}
          className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-accent/50 transition-all text-right group cursor-pointer"
        >
          {next.imageUrl && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
              <Image
                src={next.imageUrl}
                alt=""
                fill
                className="object-cover"
                loader={({ src }) => src}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Next</p>
            <p className="text-sm font-medium text-foreground line-clamp-1">
              {next.title}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}
