-- First add the slug column as nullable
ALTER TABLE "Post" ADD COLUMN "slug" TEXT;

-- Add other new columns
ALTER TABLE "Post" ADD COLUMN "bannerImage" TEXT;
ALTER TABLE "Post" ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0;

-- Create new tables
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- Create indexes and constraints
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "Like"("userId", "postId");
CREATE UNIQUE INDEX "Bookmark_userId_postId_key" ON "Bookmark"("userId", "postId");
CREATE INDEX "Post_slug_idx" ON "Post"("slug");

-- Add foreign key constraints
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- After running the TypeScript migration script, make slug required and unique
ALTER TABLE "Post" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");