"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import CategoryMain from "../Category/CategoryMain";
import { useBlogWriteMutation } from "@/hooks/useBlogWriteMutations";
import { Button } from "@/components/ui/button";
import ImagePicker from "../common/ImagePicker";
import { UploadToS3 } from "../common/UploadToS3";
import Editor from "../common/Editor";
import { useBlogDetails } from "@/hooks/useBlogDetails";
import type { Editor as TiptapEditor } from "@tiptap/react";
import { useVideoStore } from "@/store/useVideoStore";
import axios from "axios";
import { X } from "lucide-react";

export default function BlogForm({ id }: { id: string }) {
  const [editor, setEditor] = useState<TiptapEditor | null>(null);
  const [category, setCategory] = useState("");
  const [pickedImage, setPickedImage] = useState<File | null | string>(null);
  const { data } = useBlogDetails(Number(id));
  const { mutate: saveMutation, isPending: savingPending } =
    useBlogWriteMutation();
  const { getFile } = useVideoStore();

  const { register, setValue, getValues, handleSubmit, watch, reset } =
    useForm<BlogForm>({
      defaultValues: {
        title: "",
        content: "",
        tags: [],
        category: "",
        imageUrl: "",
        privateYn: false,
        pinnedYn: false,
      },
    });
  watch("tags");

  useEffect(() => {
    if (!data?.details) return;
    setPickedImage(data.details.imageUrl);
    setCategory(data.details.categoryId);
    reset({
      id: data.details.id ?? 0,
      title: data.details.title ?? "",
      tags: data.details.blogTags.map(
        (bt: { tag: { name: string } }) => bt.tag.name
      ),
      privateYn: !!data.details.privateYn,
      category: String(data.details.category ?? ""),
    });
  }, [data, reset]);

  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keys = ["Enter", "Tab"];
    if (keys.includes(e.key)) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim().toLowerCase();
      const currentTags = getValues("tags");
      if (currentTags.length >= 10) {
        toast.error("Maximum 10 tags allowed.");
        return;
      }
      if (newTag && !currentTags.includes(newTag)) {
        const newTags = [...currentTags, newTag];
        setValue("tags", newTags);
        e.currentTarget.value = "";
      }
    }
  };

  const handleTagDelete = (tag: string) => {
    const currentTags = getValues("tags");
    const newTags = currentTags.filter((t) => t != tag);
    setValue("tags", newTags);
  };

  const onSubmit = async (data: BlogForm) => {
    if (!getValues("title") || getValues("title").trim().length === 0) {
      toast.error("Title is required.");
      return false;
    }
    if (category === "") {
      toast.error("Category is required.");
      return false;
    }

    data.title = getValues("title");
    data.category = category;

    const html = editor?.getHTML();
    if (!html || html.trim().length === 0) {
      toast.error("Content is required.");
      return false;
    }

    if (pickedImage) {
      if (typeof pickedImage === "object") {
        const fileUrl = await UploadToS3(pickedImage as File, "thumbnail");
        if (!fileUrl) return false;
        data.imageUrl = fileUrl;
      }
    } else {
      toast.error("Thumbnail is required.");
      return false;
    }

    let uploadHtml = html;
    const matchesImg = [
      ...html.matchAll(
        /<img[^>]+src="((?:data:image\/[^"]+|blob:[^"]+))"[^>]*>/g
      ),
    ];

    for (let i = 0; i < matchesImg.length; i++) {
      const fullTag = matchesImg[i][0];
      const src = matchesImg[i][1];

      const res = await fetch(src);
      const blobData = await res.blob();
      const file = new File([blobData], "image.jpg", { type: blobData.type });

      const fileUrl = await UploadToS3(file, "content");
      if (!fileUrl) return false;

      const replaceTag = fullTag.replace(src, fileUrl);
      uploadHtml = uploadHtml.replace(fullTag, replaceTag);
    }

    const collectedVideos: { assetId: string; playbackId: string }[] = [];
    let uploadHtml2 = uploadHtml;
    const matchesVideo = [
      ...html.matchAll(
        /<mux-player[^>]+data-temp-id="([^"]+)"[^>]*><\/mux-player>/g
      ),
    ];

    for (let j = 0; j < matchesVideo.length; j++) {
      const fullTag = matchesVideo[j][0];
      const tempId = matchesVideo[j][1];

      try {
        const file = getFile(tempId);
        if (!file) continue;

        const muxPresignedRes = await axios.post("/api/blog/upload/video");
        if (muxPresignedRes.data.error)
          throw new Error("Mux Presigned URL generation failed");

        const { url, id, error } = muxPresignedRes.data;
        if (error || !url || !id)
          throw new Error("Mux Presigned URL generation failed");

        await axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        for (let tries = 0; tries < 10; tries++) {
          let assetId = null;
          let playbackId = null;
          const res = await axios.get(`/api/blog/upload/video?uploadId=${id}`);
          if (res.data.asset_id && res.data.playback_id) {
            assetId = res.data.asset_id;
            playbackId = res.data.playback_id;

            const videoTag = `<mux-player
                              stream-type="on-demand"
                              playback-id="${playbackId}"
                              metadata-video-title="Blog Video"
                              style="width: 100%; max-height: 400px;"
                              controls
                            ></mux-player>`;
            uploadHtml2 = uploadHtml2.replace(fullTag, videoTag);

            collectedVideos.push({ assetId, playbackId });
            break;
          }
          await new Promise((r) => setTimeout(r, 2000));
        }
      } catch (err) {
        console.error("Video upload error:", err);
        toast.error("Video upload failed.");
        return false;
      }
    }

    saveMutation({
      ...data,
      collectedVideos,
      content: uploadHtml2,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Top controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CategoryMain
              category={category ?? data?.details?.categoryId}
              setCategory={setCategory}
              readYn={false}
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-primary w-4 h-4"
                  defaultChecked={data?.details?.privateYn}
                  {...register("privateYn")}
                />
                Private
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-primary w-4 h-4"
                  defaultChecked={data?.details?.pinnedYn}
                  {...register("pinnedYn")}
                />
                Pinned
              </label>
            </div>
          </div>
          <Button type="submit" disabled={savingPending} className="px-6">
            {savingPending ? "Saving..." : "Save"}
          </Button>
        </div>

        {/* Title */}
        <input
          className="border-0 shadow-none font-bold text-3xl h-auto py-3 px-0 placeholder:text-muted-foreground/40 focus:outline-none bg-transparent"
          placeholder="Post title"
          {...register("title")}
        />

        {/* Thumbnail */}
        <ImagePicker
          pickedImage={pickedImage}
          setPickedImage={setPickedImage}
        />

        {/* Tags */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Press Enter or Tab to add tags"
            className="border-0 border-b border-border rounded-none px-0 py-2 text-sm focus:outline-none focus:border-primary transition-colors bg-transparent placeholder:text-muted-foreground"
            onKeyDown={handleTagsKeyDown}
          />
          <div className="flex flex-wrap gap-2">
            {getValues("tags").map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                onClick={() => handleTagDelete(tag)}
              >
                # {tag}
                <X className="w-3 h-3" />
              </span>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div
          className="border rounded-xl p-4 min-h-[400px] focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all"
          onClick={() => editor?.chain().focus()}
        >
          <Editor
            setEditor={setEditor}
            content={data?.details?.content ?? ""}
            readOnly={false}
          />
        </div>
      </form>
    </div>
  );
}
