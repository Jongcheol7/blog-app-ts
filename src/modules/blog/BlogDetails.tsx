"use client";
import { useBlogDetails } from "@/hooks/useBlogDetails";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Editor from "../common/Editor";
import { useCallback, useEffect, useRef, useState } from "react";
import CommentForm from "../Comment/CommentForm";
import CommentLists from "../Comment/CommentLists";
import { useSession } from "next-auth/react";
import { Eye, Lock, Pin, Clock, Trash2, Pencil, ArrowLeft } from "lucide-react";
import { getReadingTime } from "../common/readingTime";
import { useDeleteBlogMutation } from "@/hooks/useDeleteBlogMutation";
import { useSearchStore } from "@/store/useSearchStore";
import { TimeTransform } from "../common/TimeTransform";
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

  const details = data?.details;

  return (
    <>
      {details && (
        <article className="animate-fade-in-up" style={{ wordBreak: "keep-all" }}>

          {/* Hero image */}
          {details.imageUrl && (
            <div className="relative w-full aspect-[21/9] sm:aspect-[2.8/1] rounded-[2rem] overflow-hidden mb-10 img-zoom">
              <Image
                src={details.imageUrl}
                alt={details.title}
                fill
                priority
                className="object-cover"
                loader={({ src }) => src}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Back button overlay */}
              <button
                onClick={() => router.push("/blog")}
                className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/30 backdrop-blur-md text-white/80 text-sm font-medium hover:bg-black/50 transition-supanova cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            </div>
          )}

          <div className="relative">

                {/* Eyebrow: category + status badges */}
                <div className="flex items-center gap-2.5 mb-5">
                  {details.category?.name && (
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.15em] font-medium bg-primary/10 text-primary">
                      {details.category.name}
                    </span>
                  )}
                  {details.privateYn && (
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium bg-secondary text-muted-foreground">
                      <Lock className="w-3 h-3" />
                      Private
                    </span>
                  )}
                  {details.pinnedYn && (
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium bg-secondary text-muted-foreground">
                      <Pin className="w-3 h-3" />
                      Pinned
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6">
                  {details.title}
                </h1>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
                  <span>{TimeTransform(details.createdAt).date}</span>
                  <span className="text-border">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {details.views}
                  </span>
                  <span className="text-border">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {getReadingTime(details.content)}
                  </span>
                  <div className="ml-auto">
                    <ShareButtons title={details.title} />
                  </div>
                </div>

                {/* Tags */}
                {details.blogTags && details.blogTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {details.blogTags.map(
                      (bt: { tag: { id: number; name: string } }) => (
                        <span
                          key={bt.tag.id}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium cursor-pointer hover:bg-primary/10 hover:text-primary transition-supanova"
                          onClick={() => {
                            setTag(bt.tag.name);
                            router.push("/blog");
                          }}
                        >
                          # {bt.tag.name}
                        </span>
                      )
                    )}
                  </div>
                )}

                {/* Gradient separator */}
                <div className="gradient-line mb-10" />

                {/* Admin actions */}
                {isAdmin && (
                  <div className="flex items-center gap-2 mb-8">
                    <button
                      onClick={() => router.push(`/edit/${id}`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-sm font-medium hover:bg-primary/10 hover:text-primary transition-supanova cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-sm font-medium text-destructive hover:bg-destructive/10 transition-supanova cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                )}

                {/* Delete confirmation */}
                {showDeleteConfirm && (
                  <div className="mb-8 p-5 rounded-2xl ring-1 ring-destructive/20 bg-destructive/5">
                    <p className="text-sm font-medium mb-3">
                      Are you sure you want to delete this post?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-full"
                        onClick={() => deleteMutate(details.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Mobile TOC */}
                <TableOfContents contentRef={contentRef} />

                {/* Editor / Content */}
                <div ref={contentRef} className="min-h-[300px] mb-16">
                  <Editor
                    setEditor={setEditor}
                    content={details.content}
                    readOnly={true}
                  />
                </div>

                {/* Prev/Next */}
                <PostNavigation blogId={details.id} />

                {/* Comments */}
                <div className="pt-10 mt-10 border-t border-border/60">
                  <CommentForm blogId={details.id} />
                  <CommentLists blogId={details.id} />
                </div>
            {/* Desktop TOC — floating right */}
            <div className="hidden xl:block fixed right-[max(1rem,calc((100vw-80rem)/2+1rem))] top-24 w-52">
              <TableOfContents contentRef={contentRef} />
            </div>
          </div>
        </article>
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
