-- CreateTable
CREATE TABLE "blog"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "blog"."Blog" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "userId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "privateYn" BOOLEAN NOT NULL,
    "categoryId" INTEGER,
    "pinnedYn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog"."BlogLikes" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "blogId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog"."Tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog"."BlogTags" (
    "blogId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BlogTags_pkey" PRIMARY KEY ("blogId","tagId")
);

-- CreateTable
CREATE TABLE "blog"."Comment" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" INTEGER,
    "secretYn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog"."Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog"."Guestbook" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "secretYn" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Guestbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog"."BlogVideo" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "assetId" TEXT NOT NULL,
    "playbackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog"."BlogViews" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogViews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "blog"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "blog"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "blog"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "blog"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "blog"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "BlogLikes_userId_blogId_key" ON "blog"."BlogLikes"("userId", "blogId");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_name_key" ON "blog"."Tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "blog"."Category"("name");

-- CreateIndex
CREATE INDEX "BlogViews_blogId_idx" ON "blog"."BlogViews"("blogId");

-- CreateIndex
CREATE INDEX "BlogViews_userId_idx" ON "blog"."BlogViews"("userId");

-- AddForeignKey
ALTER TABLE "blog"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "blog"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "blog"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."Blog" ADD CONSTRAINT "Blog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "blog"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."Blog" ADD CONSTRAINT "Blog_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "blog"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."BlogLikes" ADD CONSTRAINT "BlogLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "blog"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."BlogLikes" ADD CONSTRAINT "BlogLikes_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blog"."Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."BlogTags" ADD CONSTRAINT "BlogTags_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blog"."Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."BlogTags" ADD CONSTRAINT "BlogTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "blog"."Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "blog"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."Comment" ADD CONSTRAINT "Comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blog"."Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."Guestbook" ADD CONSTRAINT "Guestbook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "blog"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."BlogVideo" ADD CONSTRAINT "BlogVideo_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blog"."Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."BlogViews" ADD CONSTRAINT "BlogViews_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blog"."Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog"."BlogViews" ADD CONSTRAINT "BlogViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "blog"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
