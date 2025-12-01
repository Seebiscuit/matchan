-- CreateEnum
CREATE TYPE "DataFieldType" AS ENUM ('TEXT', 'NUMBER', 'DATE', 'SELECT', 'BOOLEAN');

-- AlterTable
ALTER TABLE "Single" ADD CONSTRAINT "Single_imageId_key" UNIQUE ("imageId");

-- CreateTable
CREATE TABLE "SingleAdditionalData" (
    "id" TEXT NOT NULL,
    "singleId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SingleAdditionalData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SingleAdditionalDataField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "DataFieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SingleAdditionalDataField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SingleAdditionalData_singleId_fieldId_key" ON "SingleAdditionalData"("singleId", "fieldId");

-- CreateIndex
CREATE UNIQUE INDEX "SingleAdditionalDataField_name_key" ON "SingleAdditionalDataField"("name");

-- AddForeignKey
ALTER TABLE "SingleAdditionalData" ADD CONSTRAINT "SingleAdditionalData_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "SingleAdditionalDataField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SingleAdditionalData" ADD CONSTRAINT "SingleAdditionalData_singleId_fkey" FOREIGN KEY ("singleId") REFERENCES "Single"("id") ON DELETE CASCADE ON UPDATE CASCADE;
