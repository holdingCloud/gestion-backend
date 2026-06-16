import { PrismaClient, PurchaseStatus, FrequencyStatus } from '@prisma/client';

const prisma = new PrismaClient();

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function weightedStatus(): PurchaseStatus {
  const r = Math.random();
  if (r < 0.65) return PurchaseStatus.FINALIZADO;
  if (r < 0.82) return PurchaseStatus.ANULADO;
  return PurchaseStatus.PENDIENTE;
}

const UNIT_PRICES = [2500, 3000, 3500, 4000, 4500, 5000, 6000, 7500, 9000, 10000, 12000, 15000];

async function main() {
  console.log('Iniciando seed de datos mock para reportes...');

  const [clients, products] = await Promise.all([
    prisma.clients.findMany({ where: { available: true } }),
    prisma.products.findMany({ where: { available: true } }),
  ]);

  if (clients.length === 0) {
    console.error('No hay clientes disponibles. Ejecuta primero el seed de clientes.');
    return;
  }
  if (products.length === 0) {
    console.error('No hay productos disponibles. Crea productos antes de continuar.');
    return;
  }

  console.log(`Encontrados: ${clients.length} clientes, ${products.length} productos.`);

  const startDate = new Date('2026-01-01');
  const endDate   = new Date('2026-06-15');

  // Eliminar compras mock previas en el rango para poder re-ejecutar sin duplicados
  const deleted = await prisma.buyByClient.deleteMany({
    where: {
      purchaseDate: { gte: startDate, lte: endDate },
      createdAt:    { gte: startDate },
    },
  });
  if (deleted.count > 0) console.log(`Eliminadas ${deleted.count} compras previas en el rango.`);

  const purchases: {
    clientsId: number;
    productsId: number;
    quantity: number;
    unitPrice: number;
    purchaseDate: Date;
    purchaseStatus: PurchaseStatus;
  }[] = [];

  for (const client of clients) {
    // Asignar entre 1 y min(4, total_products) productos por cliente
    const maxProds  = Math.min(4, products.length);
    const numProds  = rand(1, maxProds);
    const shuffled  = [...products].sort(() => Math.random() - 0.5).slice(0, numProds);

    for (const product of shuffled) {
      const numPurchases = rand(4, 14);
      for (let i = 0; i < numPurchases; i++) {
        purchases.push({
          clientsId:      client.id,
          productsId:     product.id,
          quantity:       rand(1, 5),
          unitPrice:      UNIT_PRICES[rand(0, UNIT_PRICES.length - 1)],
          purchaseDate:   randDate(startDate, endDate),
          purchaseStatus: weightedStatus(),
        });
      }
    }
  }

  const created = await prisma.buyByClient.createMany({ data: purchases });
  console.log(`Creadas ${created.count} compras mock.`);

  // ─── Actualizar ClientProductFrequency con las compras FINALIZADO ───────────

  const finalized = purchases.filter((p) => p.purchaseStatus === PurchaseStatus.FINALIZADO);

  const freqMap = new Map<string, typeof finalized>();
  for (const p of finalized) {
    const key = `${p.clientsId}-${p.productsId}`;
    if (!freqMap.has(key)) freqMap.set(key, []);
    freqMap.get(key)!.push(p);
  }

  let freqUpdated = 0;

  for (const [key, records] of freqMap.entries()) {
    const [clientsId, productsId] = key.split('-').map(Number);
    const sorted = [...records].sort((a, b) => a.purchaseDate.getTime() - b.purchaseDate.getTime());

    let avgDays: number | null = null;
    if (sorted.length > 1) {
      const diffs: number[] = [];
      for (let i = 1; i < sorted.length; i++) {
        const diff = Math.round(
          (sorted[i].purchaseDate.getTime() - sorted[i - 1].purchaseDate.getTime()) / 86_400_000,
        );
        if (diff > 0) diffs.push(diff);
      }
      if (diffs.length > 0) {
        avgDays = Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
      }
    }

    const actualDate  = sorted[sorted.length - 1].purchaseDate;
    const lastDate    = sorted.length > 1 ? sorted[sorted.length - 2].purchaseDate : null;
    const nextDate    = avgDays ? new Date(actualDate.getTime() + avgDays * 86_400_000) : null;
    const status: FrequencyStatus = avgDays ? FrequencyStatus.EN_PLAZO : FrequencyStatus.NUEVO;

    await (prisma as any).clientProductFrequency.upsert({
      where:  { clientsId_productsId: { clientsId, productsId } },
      create: { clientsId, productsId, purchaseCount: sorted.length, avgDaysBetweenPurchases: avgDays, lastPurchaseDate: lastDate, actualPurchaseDate: actualDate, nextEstimatedDate: nextDate, status },
      update: { purchaseCount: sorted.length, avgDaysBetweenPurchases: avgDays, lastPurchaseDate: lastDate, actualPurchaseDate: actualDate, nextEstimatedDate: nextDate, status },
    });
    freqUpdated++;
  }

  console.log(`Actualizados ${freqUpdated} registros en ClientProductFrequency.`);

  // ─── Actualizar Clients.frequency con el promedio de todos sus productos ────

  const clientFreqMap = new Map<number, number[]>();

  for (const [key, records] of freqMap.entries()) {
    const clientsId = Number(key.split('-')[0]);
    const sorted    = [...records].sort((a, b) => a.purchaseDate.getTime() - b.purchaseDate.getTime());

    if (sorted.length > 1) {
      for (let i = 1; i < sorted.length; i++) {
        const diff = Math.round(
          (sorted[i].purchaseDate.getTime() - sorted[i - 1].purchaseDate.getTime()) / 86_400_000,
        );
        if (diff > 0) {
          if (!clientFreqMap.has(clientsId)) clientFreqMap.set(clientsId, []);
          clientFreqMap.get(clientsId)!.push(diff);
        }
      }
    }
  }

  let clientsUpdated = 0;
  for (const [clientsId, diffs] of clientFreqMap.entries()) {
    if (diffs.length > 0) {
      const avg = Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
      await prisma.clients.update({ where: { id: clientsId }, data: { frequency: avg } });
      clientsUpdated++;
    }
  }

  console.log(`Actualizados ${clientsUpdated} clientes con su frecuencia media.`);
  console.log('Seed completado exitosamente.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
