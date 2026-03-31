-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" TEXT DEFAULT 'CUSTOMER';

-- DropEnum
DROP TYPE "Role";
