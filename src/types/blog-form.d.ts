type BlogForm = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  category: string;
  imageUrl: string;
  privateYn: boolean;
  pinnedYn: boolean;
  createdAt: string;
  collectedVideos: { assetId: string; playbackId: string }[];
  blogTags?: { tag: { id: number; name: string } }[];
  readingTime?: string;
};

type PinnedPost = {
  pinnedData: {
    id: number;
    title: string;
    content: string;
    imageUrl: string;
    createdAt: string;
  };
};
