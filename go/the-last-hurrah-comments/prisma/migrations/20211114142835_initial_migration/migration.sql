-- CreateEnum
CREATE TYPE "REPORT_REASON" AS ENUM ('DISAGREE', 'SPAM', 'INAPPROPRIATE_PROFILE', 'THREATENING_CONTENT', 'PRIVATE_INFORMATION');

-- CreateTable
CREATE TABLE "UpVoteRating" (
    "id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "commentId" TEXT,

    CONSTRAINT "UpVoteRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownVoteRating" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "commentId" TEXT,

    CONSTRAINT "DownVoteRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reason" "REPORT_REASON" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "commentId" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "plain_text_body" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "replied_to_id" TEXT,
    "rating_id" TEXT,
    "comment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "json_body" JSONB NOT NULL,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "reply_notification" BOOLEAN NOT NULL DEFAULT true,
    "threatening_content" BOOLEAN NOT NULL DEFAULT false,
    "private_information" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "pending" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "spam" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UpVoteRating" ADD CONSTRAINT "UpVoteRating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownVoteRating" ADD CONSTRAINT "DownVoteRating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
