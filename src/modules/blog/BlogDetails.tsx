"use client";
import { useBlogDetails } from "@/hooks/useBlogDetails";
import CategoryMain from "../Category/CategoryMain";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Editor from "../common/Editor";
import { useCallback, useEffect, useRef, useState } from "react";
import CommentForm from "../Comment/CommentForm";
import CommentLists from "../Comment/CommentLists";
import { useSession } from "next-auth/react";
import { Eye, Lock, Pin, Clock, Trash2 } from "lucide-react";
import { getReadingTime } from "../common/readingTime";
import { useDeleteBlogMutation } from "@/hooks/useDeleteBlogMutation";
import { useSearchStore } from "@/store/useSearchStore";
import TableOfContents from "./TableOfContents";
import PostNavigation from "./PostNavigation";
import ShareButtons from "./ShareButtons";
import ImageLightbox from "./ImageLightbox";

export default function BlogDetails({ id }: { id: string }) {
  const { data } = useBlogDetails(Number(id));
  const { data: session } = useSession();
  const [, setEditor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();
  const isAdmin = session?.user.isAdmin;
  const { mutate: deleteMutate, isPending: isDeleting } =
    useDeleteBlogMutation();
  const { setTag } = useSearchStore();
  const contentRef = useRef<HTMLDivElement>(null);

  // Image lightbox
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const setupLightbox = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    const timer = setTimeout(() => {
      const imgs = el.querySelectorAll(".tiptap img");
      const srcs: string[] = [];
      imgs.forEach((img) => {
        const src = img.getAttribute("src");
        if (src) srcs.push(src);
      });
      setLightboxImages(srcs);

      imgs.forEach((img, i) => {
        (img as HTMLElement).style.cursor = "zoom-in";
        img.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setLightboxIndex(i);
        });
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (data?.details) {
      return setupLightbox();
    }
  }, [data, setupLightbox]);

  // Code copy buttons
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !data?.details) return;

    const timer = setTimeout(() => {
      const pres = el.querySelectorAll(".tiptap pre");
      pres.forEach((pre) => {
        if (pre.querySelector(".code-copy-btn")) return;
        const btn = document.createElement("button");
        btn.className =
          "code-copy-btn absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors text-xs";
        btn.textContent = "Copy";
        btn.onclick = async () => {
          await navigator.clipboard.writeText(pre.textContent || "");
          btn.textContent = "Copied!";
          setTimeout(() => {
            btn.textContent = "Copy";
          }, 2000);
        };
        (pre as HTMLElement).style.position = "relative";
        pre.appendChild(btn);
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [data]);

  return (
    <>
      {data && data.details && (
        <div className="max-w-5xl mx-auto py-8 animate-fade-in-up">
          <div className="flex gap-8">
            {/* Main content */}
            <div className="flex-1 min-w-0 max-w-3xl">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <CategoryMain
                    category={data.details.categoryId}
                    setCategory={() => {}}
                    readYn={true}
                  />
                  <div className="flex items-center gap-2">
                    {data.details.privateYn && (
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="w-3 h-3" />
                        Private
                      </Badge>
                    )}
                    {data.details.pinnedYn && (
                      <Badge variant="secondary" className="gap-1">
                        <Pin className="w-3 h-3" />
                        Pinned
                      </Badge>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/edit/${id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive hover:text-white"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Delete confirmation */}
              {showDeleteConfirm && (
                <div className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/5">
                  <p className="text-sm font-medium mb-3">
                    Are you sure you want to delete this post?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutate(data.details.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight mb-8">
                {data.details.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{data.details.views} views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{getReadingTime(data.details.content)}</span>
                </div>
                <ShareButtons title={data.details.title} />
              </div>

              {/* Tags */}
              {data.details.blogTags && data.details.blogTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {data.details.blogTags.map(
                    (bt: { tag: { id: number; name: string } }) => (
                      <Badge
                        key={bt.tag.id}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={() => {
                          setTag(bt.tag.name);
                          router.push("/blog");
                        }}
                      >
                        # {bt.tag.name}
                      </Badge>
                    )
                  )}
                </div>
              )}

              {/* Mobile TOC */}
              <TableOfContents contentRef={contentRef} />

              {/* Editor / Content */}
              <div ref={contentRef} className="min-h-[300px] mb-12">
                <Editor
                  setEditor={setEditor}
                  content={data.details.content}
                  readOnly={true}
                />
              </div>

              {/* Prev/Next */}
              <PostNavigation blogId={data.details.id} />

              {/* Comments */}
              <div className="pt-8 border-t border-border">
                <CommentForm blogId={data.details.id} />
                <CommentLists blogId={data.details.id} />
              </div>
            </div>

            {/* Desktop TOC sidebar */}
            <div className="hidden lg:block w-56 shrink-0">
              <TableOfContents contentRef={contentRef} />
            </div>
          </div>
        </div>
      )}

      {/* Image lightbox */}
      {lightboxIndex >= 0 && lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
