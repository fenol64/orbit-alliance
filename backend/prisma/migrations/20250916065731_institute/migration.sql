-- AlterTable
ALTER TABLE "public"."institutions" ADD COLUMN     "wallet" TEXT;

-- AlterTable
ALTER TABLE "public"."products" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."purchases" ALTER COLUMN "priceAtPurchase" SET DATA TYPE DOUBLE PRECISION;
