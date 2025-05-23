/*
  Warnings:

  - You are about to drop the column `claimedAt` on the `Claim` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Claim` table. All the data in the column will be lost.
  - You are about to drop the column `evening` on the `Claim` table. All the data in the column will be lost.
  - You are about to drop the column `morning` on the `Claim` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Claim` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isClaimed` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Claim` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Claim" DROP COLUMN "claimedAt",
DROP COLUMN "date",
DROP COLUMN "evening",
DROP COLUMN "morning",
DROP COLUMN "total",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isClaimed" BOOLEAN NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
