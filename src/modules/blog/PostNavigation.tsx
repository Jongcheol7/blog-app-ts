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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
      {prev ? (
        <button
          onClick={() => router.push(`/details/${prev.id}`)}
          className="flex items-center gap-4 p-4 rounded-2xl ring-1 ring-border/50 bg-secondary/30 hover:bg-secondary/60 transition-supanova text-left group cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary group-hover:-translate-x-0.5 transition-supanova" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground/60 mb-1">Previous</p>
            <p className="text-sm font-medium text-foreground line-clamp-1 leading-snug">
              {prev.title}
            </p>
          </div>
          {prev.imageUrl && (
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 img-zoom">
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
          className="flex items-center gap-4 p-4 rounded-2xl ring-1 ring-border/50 bg-secondary/30 hover:bg-secondary/60 transition-supanova text-right group cursor-pointer"
        >
          {next.imageUrl && (
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 img-zoom">
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
            <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground/60 mb-1">Next</p>
            <p className="text-sm font-medium text-foreground line-clamp-1 leading-snug">
              {next.title}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-supanova" />
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}
