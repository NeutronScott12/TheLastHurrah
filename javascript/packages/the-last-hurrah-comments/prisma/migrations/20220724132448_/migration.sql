-- DropForeignKey
ALTER TABLE "DownVoteRating" DROP CONSTRAINT "DownVoteRating_commentId_fkey";

-- DropForeignKey
ALTER TABLE "UpVoteRating" DROP CONSTRAINT "UpVoteRating_commentId_fkey";

-- AddForeignKey
ALTER TABLE "UpVoteRating" ADD CONSTRAINT "UpVoteRating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownVoteRating" ADD CONSTRAINT "DownVoteRating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
