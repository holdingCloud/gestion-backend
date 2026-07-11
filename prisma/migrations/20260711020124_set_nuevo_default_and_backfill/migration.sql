-- AlterTable: nueva columna para el override manual de contactStatus (ventana de bloqueo)
ALTER TABLE "Clients" ADD COLUMN "contactStatusLockedUntil" TIMESTAMP(3);

-- AlterTable: el estado inicial de un cliente pasa a ser NUEVO
ALTER TABLE "Clients" ALTER COLUMN "contactStatus" SET DEFAULT 'NUEVO';

-- Backfill: todo cliente sin ninguna compra finalizada (misma señal que lee
-- refreshClientStatus: ClientProductFrequency con actualPurchaseDate) pasa a NUEVO.
UPDATE "Clients" c
SET "contactStatus" = 'NUEVO'
WHERE NOT EXISTS (
  SELECT 1 FROM "ClientProductFrequency" f
  WHERE f."clientsId" = c.id AND f."actualPurchaseDate" IS NOT NULL
);
