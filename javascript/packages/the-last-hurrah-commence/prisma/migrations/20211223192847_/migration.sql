/*
  Warnings:

  - A unique constraint covering the columns `[email,phone_number,customer_id]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customer_id` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Customer_email_phone_number_key";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "customer_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_phone_number_customer_id_key" ON "Customer"("email", "phone_number", "customer_id");
