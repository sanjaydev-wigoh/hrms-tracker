/*
  Warnings:

  - You are about to drop the column `amount` on the `Claim` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Claim` table. All the data in the column will be lost.
  - You are about to drop the column `isClaimed` on the `Claim` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Claim` table. All the data in the column will be lost.
  - Added the required column `date` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evening` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `morning` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Claim` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Claim" DROP COLUMN "amount",
DROP COLUMN "createdAt",
DROP COLUMN "isClaimed",
DROP COLUMN "updatedAt",
ADD COLUMN     "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "evening" INTEGER NOT NULL,
ADD COLUMN     "morning" INTEGER NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL;
