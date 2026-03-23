"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { ImagePlus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  pickedImage: File | null | string;
  setPickedImage: (val: File | null | string) => void;
};

export default function ImagePicker({ pickedImage, setPickedImage }: Props) {
  const onDrop = useCallback(
    async (files: File[]) => {
      if (
        typeof pickedImage === "string" &&
        pickedImage.startsWith(
          process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN_NAME as string
        )
      ) {
        fetch("/api/blog/upload/delete", {
          method: "POST",
          body: JSON.stringify({ imageUrl: pickedImage, folder: "thumbnail" }),
          headers: { "Content-Type": "application/json" },
        });
      }

      if (files.length > 1) {
        toast.error("Only one image allowed.");
        return false;
      }
      if (!files[0].type.startsWith("image/")) {
        toast.error("Only image files allowed.");
        return false;
      }

      const compressedFile = await imageCompression(files[0], {
        maxSizeMB: 2,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });

      setPickedImage(compressedFile);
    },
    [setPickedImage, pickedImage]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    maxFiles: 1,
    noClick: true,
  });

  return (
    <div className="flex items-center gap-3">
      <div {...getRootProps({})} onClick={open}>
        {!pickedImage ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center w-40 h-28 rounded-xl border-2 border-dashed border-border",
              "hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer group",
              isDragActive && "border-primary bg-primary/5"
            )}
          >
            <ImagePlus className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-xs text-muted-foreground mt-2">
              {isDragActive ? "Drop here" : "Thumbnail"}
            </span>
          </div>
        ) : (
          <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-border group cursor-pointer">
            <Image
              src={
                typeof pickedImage === "string"
                  ? pickedImage
                  : URL.createObjectURL(pickedImage)
              }
              alt="Selected Image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
        <input {...getInputProps()} type="file" className="hidden" />
      </div>
      <Button variant="outline" size="sm" onClick={(e) => { e.preventDefault(); open(); }}>
        Upload
      </Button>
    </div>
  );
}
