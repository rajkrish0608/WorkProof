-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'STAFF');

-- AlterTable
ALTER TABLE "Contractor" ADD COLUMN     "managerId" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'OWNER';

-- AddForeignKey
ALTER TABLE "Contractor" ADD CONSTRAINT "Contractor_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Contractor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
