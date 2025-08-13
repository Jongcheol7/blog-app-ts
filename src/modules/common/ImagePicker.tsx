"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

type Props = {
  pickedImage: File | null | string;
  setPickedImage: (val: File | null | string) => void;
};

export default function ImagePicker({ pickedImage, setPickedImage }: Props) {
  const onDrop = useCallback(
    async (files: File[]) => {
      if (files.length > 1) {
        toast.error("사진은 한장만 첨부 가능합니다.");
        return false;
      }
      if (!files[0].type.startsWith("image/")) {
        toast.error("사진만 첨부 가능합니다.");
        return false;
      }

      const compressedFile = await imageCompression(files[0], {
        maxSizeMB: 2,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });

      setPickedImage(compressedFile);
    },
    [setPickedImage]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    maxFiles: 1,
    noClick: true,
  });

  return (
    <div className="flex gap-2">
      <div {...getRootProps({})} onClick={open}>
        {!pickedImage ? (
          <div className="font-light text-center w-30 h-24 border border-gray-300 py-2 text-sm">
            {isDragActive ? (
              <p>Attaching..</p>
            ) : (
              <p>Thumbnail Picture Attach</p>
            )}
          </div>
        ) : (
          <Image
            src={
              typeof pickedImage === "string"
                ? pickedImage
                : URL.createObjectURL(pickedImage)
            }
            alt="Selected Image"
            width={150}
            height={120}
            className="border object-cover"
          />
        )}
        <input
          {...getInputProps()}
          type="file"
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
        />
      </div>
      <Button
        variant={"secondary"}
        onClick={(e) => {
          e.preventDefault();
          open();
        }}
      >
        사진 첨부
      </Button>
    </div>
  );
}
