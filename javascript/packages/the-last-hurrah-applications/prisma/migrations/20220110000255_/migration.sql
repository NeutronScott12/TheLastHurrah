-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "subscriptionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
