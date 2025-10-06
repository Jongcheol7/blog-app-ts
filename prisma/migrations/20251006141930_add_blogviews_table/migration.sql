-- CreateTable
CREATE TABLE "public"."BlogViews" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogViews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlogViews_blogId_idx" ON "public"."BlogViews"("blogId");

-- CreateIndex
CREATE INDEX "BlogViews_userId_idx" ON "public"."BlogViews"("userId");

-- AddForeignKey
ALTER TABLE "public"."BlogViews" ADD CONSTRAINT "BlogViews_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "public"."Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogViews" ADD CONSTRAINT "BlogViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
