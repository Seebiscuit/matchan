/*
  Warnings:

  - You are about to drop the column `image_path` on the `Single` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Single` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `Single` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Single" DROP COLUMN "image_path",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "updatedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Single" ADD CONSTRAINT "Single_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Single" ADD CONSTRAINT "Single_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
