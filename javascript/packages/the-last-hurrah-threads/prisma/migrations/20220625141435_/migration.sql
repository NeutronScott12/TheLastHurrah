-- DropForeignKey
ALTER TABLE "View" DROP CONSTRAINT "View_threadId_fkey";

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
