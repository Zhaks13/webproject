-- CreateEnum
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'OrderType'
        AND n.nspname = 'orders'
    ) THEN
        CREATE TYPE "orders"."OrderType" AS ENUM ('PRODUCT', 'CUSTOM');
    END IF;
END $$;

-- AlterTable
ALTER TABLE "orders"."Order"
ADD COLUMN IF NOT EXISTS "customDescription" TEXT,
ADD COLUMN IF NOT EXISTS "customTitle" TEXT,
ADD COLUMN IF NOT EXISTS "displayName" TEXT,
ADD COLUMN IF NOT EXISTS "type" "orders"."OrderType" NOT NULL DEFAULT 'PRODUCT';
