import { PrismaClient, ContactStatus, FrequencyStatus, PurchaseStatus } from '@prisma/client';

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function daysFromNow(n: number): Date {
  return new Date(Date.now() + n * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log('🌱 Iniciando seed de datos mock para clientes...\n');

  // ─── Limpiar datos previos ──────────────────────────────────────────────────

  const testClientIds = [1, 3, 5, 6];
  await prisma.buyByClient.deleteMany({ where: { clientsId: { in: testClientIds } } });
  await (prisma as any).clientProductFrequency.deleteMany({ where: { clientsId: { in: testClientIds } } });
  console.log('🗑  Compras y frecuencias previas eliminadas.\n');

  // ─── Escenario 1: Cliente 1 (Pochilda) → VENCIDO ───────────────────────────
  // 2 compras finalizadas: última hace 45 días, avg 30 días → contactStatus VENCIDO al consultar
  {
    const clientId = 1;
    const productId = 1;

    // Primera compra (FINALIZADA) — hace 75 días
    const p1 = await prisma.buyByClient.create({
      data: {
        clientsId: clientId, productsId: productId, quantity: 3, unitPrice: 4500,
        purchaseDate: daysAgo(75), purchaseStatus: PurchaseStatus.FINALIZADO,
        createdAt: daysAgo(75), updatedAt: daysAgo(75),
      },
    });

    await (prisma as any).clientProductFrequency.upsert({
      where: { clientsId_productsId: { clientsId: clientId, productsId: productId } },
      create: { clientsId: clientId, productsId: productId, purchaseCount: 1, avgDaysBetweenPurchases: null, lastPurchaseDate: null, actualPurchaseDate: daysAgo(75), nextEstimatedDate: null, status: FrequencyStatus.NUEVO },
      update: { purchaseCount: 1, avgDaysBetweenPurchases: null, lastPurchaseDate: null, actualPurchaseDate: daysAgo(75), nextEstimatedDate: null, status: FrequencyStatus.NUEVO },
    });

    // Segunda compra (FINALIZADA) — hace 45 días → avg = 30, nextEstimated = hace 15 días → VENCIDO
    await prisma.buyByClient.create({
      data: {
        clientsId: clientId, productsId: productId, quantity: 3, unitPrice: 4500,
        purchaseDate: daysAgo(45), purchaseStatus: PurchaseStatus.FINALIZADO,
        createdAt: daysAgo(45), updatedAt: daysAgo(45),
      },
    });

    await (prisma as any).clientProductFrequency.upsert({
      where: { clientsId_productsId: { clientsId: clientId, productsId: productId } },
      create: { clientsId: clientId, productsId: productId, purchaseCount: 2, avgDaysBetweenPurchases: 30, lastPurchaseDate: daysAgo(75), actualPurchaseDate: daysAgo(45), nextEstimatedDate: daysAgo(15), status: FrequencyStatus.VENCIDO },
      update: { purchaseCount: 2, avgDaysBetweenPurchases: 30, lastPurchaseDate: daysAgo(75), actualPurchaseDate: daysAgo(45), nextEstimatedDate: daysAgo(15), status: FrequencyStatus.VENCIDO },
    });

    await prisma.clients.update({ where: { id: clientId }, data: { contactStatus: ContactStatus.VENCIDO } });
    console.log(`✅ Cliente 1 (Pochilda): 2 compras prod.1 → avg 30d, vence hace 15d → VENCIDO`);
  }

  // ─── Escenario 2: Cliente 3 (Carlos) → LLAMAR (próximo en 2 días) ───────────
  // avg 30d, actualPurchaseDate hace 28 días → faltan 2 días → LLAMAR
  {
    const clientId = 3;
    const productId = 1;

    await prisma.buyByClient.create({
      data: {
        clientsId: clientId, productsId: productId, quantity: 5, unitPrice: 4500,
        purchaseDate: daysAgo(60), purchaseStatus: PurchaseStatus.FINALIZADO,
        createdAt: daysAgo(60), updatedAt: daysAgo(60),
      },
    });
    await prisma.buyByClient.create({
      data: {
        clientsId: clientId, productsId: productId, quantity: 5, unitPrice: 4500,
        purchaseDate: daysAgo(28), purchaseStatus: PurchaseStatus.FINALIZADO,
        createdAt: daysAgo(28), updatedAt: daysAgo(28),
      },
    });

    await (prisma as any).clientProductFrequency.upsert({
      where: { clientsId_productsId: { clientsId: clientId, productsId: productId } },
      create: { clientsId: clientId, productsId: productId, purchaseCount: 2, avgDaysBetweenPurchases: 32, lastPurchaseDate: daysAgo(60), actualPurchaseDate: daysAgo(28), nextEstimatedDate: daysFromNow(4), status: FrequencyStatus.EN_PLAZO },
      update: { purchaseCount: 2, avgDaysBetweenPurchases: 32, lastPurchaseDate: daysAgo(60), actualPurchaseDate: daysAgo(28), nextEstimatedDate: daysFromNow(4), status: FrequencyStatus.EN_PLAZO },
    });

    // Compra de producto 2: NUEVO (1 sola compra)
    await prisma.buyByClient.create({
      data: {
        clientsId: clientId, productsId: 2, quantity: 2, unitPrice: 3200,
        purchaseDate: daysAgo(5), purchaseStatus: PurchaseStatus.FINALIZADO,
        createdAt: daysAgo(5), updatedAt: daysAgo(5),
      },
    });
    await (prisma as any).clientProductFrequency.upsert({
      where: { clientsId_productsId: { clientsId: clientId, productsId: 2 } },
      create: { clientsId: clientId, productsId: 2, purchaseCount: 1, avgDaysBetweenPurchases: null, lastPurchaseDate: null, actualPurchaseDate: daysAgo(5), nextEstimatedDate: null, status: FrequencyStatus.NUEVO },
      update: { purchaseCount: 1, avgDaysBetweenPurchases: null, lastPurchaseDate: null, actualPurchaseDate: daysAgo(5), nextEstimatedDate: null, status: FrequencyStatus.NUEVO },
    });

    await prisma.clients.update({ where: { id: clientId }, data: { contactStatus: ContactStatus.CONTACTADO } });
    console.log(`✅ Cliente 3 (Carlos): prod.1 avg 32d / última hace 28d → faltan 4d | prod.2 → NUEVO | CONTACTADO`);
  }

  // ─── Escenario 3: Cliente 5 (Pedro) → EN_PLAZO ──────────────────────────────
  // avg 35d, última hace 10d → faltan 25d → EN_PLAZO, contactStatus CONTACTADO
  {
    const clientId = 5;
    const productId = 1;

    await prisma.buyByClient.create({
      data: {
        clientsId: clientId, productsId: productId, quantity: 10, unitPrice: 4500,
        purchaseDate: daysAgo(45), purchaseStatus: PurchaseStatus.FINALIZADO,
        createdAt: daysAgo(45), updatedAt: daysAgo(45),
      },
    });
    await prisma.buyByClient.create({
      data: {
        clientsId: clientId, productsId: productId, quantity: 10, unitPrice: 4500,
        purchaseDate: daysAgo(10), purchaseStatus: PurchaseStatus.FINALIZADO,
        createdAt: daysAgo(10), updatedAt: daysAgo(10),
      },
    });

    await (prisma as any).clientProductFrequency.upsert({
      where: { clientsId_productsId: { clientsId: clientId, productsId: productId } },
      create: { clientsId: clientId, productsId: productId, purchaseCount: 2, avgDaysBetweenPurchases: 35, lastPurchaseDate: daysAgo(45), actualPurchaseDate: daysAgo(10), nextEstimatedDate: daysFromNow(25), status: FrequencyStatus.EN_PLAZO },
      update: { purchaseCount: 2, avgDaysBetweenPurchases: 35, lastPurchaseDate: daysAgo(45), actualPurchaseDate: daysAgo(10), nextEstimatedDate: daysFromNow(25), status: FrequencyStatus.EN_PLAZO },
    });

    await prisma.clients.update({ where: { id: clientId }, data: { contactStatus: ContactStatus.CONTACTADO } });
    console.log(`✅ Cliente 5 (Pedro): avg 35d, última hace 10d → faltan 25d → EN_PLAZO | CONTACTADO`);
  }

  // ─── Escenario 4: Cliente 6 (Ana) → NUEVO ───────────────────────────────────
  // 1 sola compra, compra pendiente también
  {
    const clientId = 6;
    const productId = 3;

    // Compra FINALIZADA
    await prisma.buyByClient.create({
      data: {
        clientsId: clientId, productsId: productId, quantity: 1, unitPrice: 8900,
        purchaseDate: daysAgo(8), purchaseStatus: PurchaseStatus.FINALIZADO,
        createdAt: daysAgo(8), updatedAt: daysAgo(8),
      },
    });

    await (prisma as any).clientProductFrequency.upsert({
      where: { clientsId_productsId: { clientsId: clientId, productsId: productId } },
      create: { clientsId: clientId, productsId: productId, purchaseCount: 1, avgDaysBetweenPurchases: null, lastPurchaseDate: null, actualPurchaseDate: daysAgo(8), nextEstimatedDate: null, status: FrequencyStatus.NUEVO },
      update: { purchaseCount: 1, avgDaysBetweenPurchases: null, lastPurchaseDate: null, actualPurchaseDate: daysAgo(8), nextEstimatedDate: null, status: FrequencyStatus.NUEVO },
    });

    // Compra PENDIENTE (para probar el flujo de finalización)
    await prisma.buyByClient.create({
      data: {
        clientsId: clientId, productsId: productId, quantity: 2, unitPrice: 8900,
        purchaseDate: daysFromNow(0), purchaseStatus: PurchaseStatus.PENDIENTE,
      },
    });

    await prisma.clients.update({ where: { id: clientId }, data: { contactStatus: ContactStatus.LLAMAR } });
    console.log(`✅ Cliente 6 (Ana): 1 compra finalizada prod.3 → NUEVO | 1 compra PENDIENTE | LLAMAR`);
  }

  console.log('\n📊 Resumen de escenarios mock:');
  console.log('─────────────────────────────────────────────────────────────────────');
  console.log('Cliente 1 (Pochilda) → VENCIDO     (avg 30d, última hace 45d)');
  console.log('Cliente 3 (Carlos)   → CONTACTADO  (avg 32d, faltan 4d → irá a LLAMAR pronto)');
  console.log('Cliente 5 (Pedro)    → CONTACTADO  (avg 35d, faltan 25d → EN_PLAZO)');
  console.log('Cliente 6 (Ana)      → LLAMAR      (sin frecuencia, compra PENDIENTE)');
  console.log('─────────────────────────────────────────────────────────────────────');
  console.log('✨ Seed mock completado!\n');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (error) => {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
