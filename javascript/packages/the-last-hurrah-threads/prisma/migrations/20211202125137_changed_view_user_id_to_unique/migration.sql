/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `View` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "View_user_id_key" ON "View"("user_id");
