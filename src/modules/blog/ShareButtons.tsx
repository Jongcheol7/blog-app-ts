"use client";

import { Link2, Share2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  title: string;
};

export default function ShareButtons({ title }: Props) {
  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const shareOnX = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    window.open(
      `https://x.com/intent/tweet?url=${url}&text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={copyLink}
        className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        title="Copy link"
      >
        <Link2 className="w-4 h-4" />
      </button>
      <button
        onClick={shareOnX}
        className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        title="Share on X"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
}
