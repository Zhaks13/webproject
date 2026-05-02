-- CreateTable
CREATE TABLE IF NOT EXISTS "orders"."OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- Backfill existing one-product orders before removing the legacy columns.
INSERT INTO "orders"."OrderItem" ("orderId", "productId", "quantity", "price", "createdAt")
SELECT
    "id",
    "productId",
    COALESCE("quantity", 1),
    CASE
        WHEN "totalPrice" IS NOT NULL AND COALESCE("quantity", 1) > 0 THEN "totalPrice" / COALESCE("quantity", 1)
        ELSE NULL
    END,
    COALESCE("createdAt", CURRENT_TIMESTAMP)
FROM "orders"."Order"
WHERE "productId" IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM "orders"."OrderItem" existing_item
    WHERE existing_item."orderId" = "orders"."Order"."id"
    AND existing_item."productId" = "orders"."Order"."productId"
);

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'OrderItem_orderId_fkey'
    ) THEN
        ALTER TABLE "orders"."OrderItem"
        ADD CONSTRAINT "OrderItem_orderId_fkey"
        FOREIGN KEY ("orderId") REFERENCES "orders"."Order"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- Drop legacy one-product columns after the data has been copied.
ALTER TABLE "orders"."Order" DROP COLUMN IF EXISTS "productId";
ALTER TABLE "orders"."Order" DROP COLUMN IF EXISTS "quantity";
