-- Baseline for databases that were previously created with prisma db push.
CREATE SCHEMA IF NOT EXISTS "orders";

-- CreateTable
CREATE TABLE IF NOT EXISTS "orders"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "orders"."Order" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "whatsapp" BOOLEAN DEFAULT false,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "paymentMethod" TEXT NOT NULL DEFAULT 'CASH',
    "comment" TEXT,
    "adminComment" TEXT,
    "source" TEXT NOT NULL DEFAULT 'WEB',
    "totalPrice" DOUBLE PRECISION,
    "selectedOptions" JSONB,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "productId" INTEGER,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "orders"."User"("phone");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'Order_userId_fkey'
    ) THEN
        ALTER TABLE "orders"."Order"
        ADD CONSTRAINT "Order_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "orders"."User"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
