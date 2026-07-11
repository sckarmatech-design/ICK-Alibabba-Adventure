-- AlterTable
ALTER TABLE "Expedition" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "depositAmount" INTEGER,
ADD COLUMN     "price" INTEGER,
ADD COLUMN     "priceExcludes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "priceIncludes" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "depositAmount" INTEGER,
ADD COLUMN     "price" INTEGER,
ADD COLUMN     "priceExcludes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "priceIncludes" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "depositAmount" INTEGER,
ADD COLUMN     "price" INTEGER,
ADD COLUMN     "priceExcludes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "priceIncludes" TEXT[] DEFAULT ARRAY[]::TEXT[];
