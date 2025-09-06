-- CreateTable
CREATE TABLE "public"."BlogVideo" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "assetId" TEXT NOT NULL,
    "playbackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogVideo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."BlogVideo" ADD CONSTRAINT "BlogVideo_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "public"."Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
