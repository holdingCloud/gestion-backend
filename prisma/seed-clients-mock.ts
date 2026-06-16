import { PrismaClient, PurchaseStatus, FrequencyStatus, ContactStatus } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Helpers ────────────────────────────────────────────────────────────────

function rInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateInRange(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function sortByDate(dates: Date[]): Date[] {
  return [...dates].sort((a, b) => a.getTime() - b.getTime());
}

// ─── Datos mock ──────────────────────────────────────────────────────────────

const MOCK_CLIENTS = [
  { fullname: 'Valentina Morales Reyes',   address: 'Av. Providencia 1250',       n_depto_casa: 'Dpto 4B',     phone: '+56912340001', email: 'valentina.morales@mock.cl',   referencia: 'Frente a la farmacia' },
  { fullname: 'Rodrigo Fuentes Castillo',  address: 'Los Nogales 85',             phone: '+56912340002', email: 'rodrigo.fuentes@mock.cl' },
  { fullname: 'Camila Torres Vega',        address: 'Calle Ñuble 420',            n_depto_casa: 'Casa 3',      phone: '+56912340003', email: 'camila.torres@mock.cl' },
  { fullname: 'Sebastián Araya Muñoz',     address: 'Av. Grecia 2300',            phone: '+56912340004', email: 'sebastian.araya@mock.cl',   referencia: 'Edificio azul, portero' },
  { fullname: 'Daniela Rojas Soto',        address: 'Pasaje Las Flores 12',       phone: '+56912340005', email: 'daniela.rojas@mock.cl' },
  { fullname: 'Ignacio Herrera Lagos',     address: 'Santa Rosa 760',             n_depto_casa: 'Of. 22',      phone: '+56912340006', email: 'ignacio.herrera@mock.cl' },
  { fullname: 'Javiera Contreras Pizarro', address: 'Av. Vicuña Mackenna 3100',   phone: '+56912340007', email: 'javiera.contreras@mock.cl',  referencia: 'Junto al semáforo' },
  { fullname: 'Felipe Navarro Bravo',      address: 'Los Aromos 55',              phone: '+56912340008', email: 'felipe.navarro@mock.cl' },
  { fullname: 'Carolina Mendoza Ibáñez',   address: 'Calle Larga 890',            n_depto_casa: 'Dpto 1A',     phone: '+56912340009', email: 'carolina.mendoza@mock.cl' },
  { fullname: 'Matías Vargas Espinoza',    address: 'Av. El Bosque Sur 130',      phone: '+56912340010', email: 'matias.vargas@mock.cl',     referencia: 'Casa con reja verde' },
  { fullname: 'Francisca Núñez Cerda',     address: 'Condell 45',                 phone: '+56912340011', email: 'francisca.nunez@mock.cl' },
  { fullname: 'Andrés Poblete Quiroga',    address: 'Av. Marathon 1265',          phone: '+56912340012', email: 'andres.poblete@mock.cl' },
  { fullname: 'Isidora Fuentes Moya',      address: 'Los Militares 5500',         n_depto_casa: 'Torre B 6D', phone: '+56912340013', email: 'isidora.fuentes@mock.cl' },
  { fullname: 'Cristóbal Lara Sandoval',   address: 'Arturo Prat 220',            phone: '+56912340014', email: 'cristobal.lara@mock.cl',    referencia: 'Portón negro' },
  { fullname: 'Sofía Sepúlveda Díaz',      address: 'Camino El Alba 11100',       phone: '+56912340015', email: 'sofia.sepulveda@mock.cl' },
  { fullname: 'Gabriel Ramos Cortés',      address: 'Av. Las Industrias 840',     phone: '+56912340016', email: 'gabriel.ramos@mock.cl' },
  { fullname: 'Alejandra Cabrera Flores',  address: 'Pedro de Valdivia 111',      n_depto_casa: 'Dpto 7',     phone: '+56912340017', email: 'alejandra.cabrera@mock.cl' },
  { fullname: 'Diego Palma Reyes',         address: 'Av. Irarrázaval 3050',       phone: '+56912340018', email: 'diego.palma@mock.cl',       referencia: 'Local al lado del kiosko' },
  { fullname: 'Natalia Ortiz Gutiérrez',   address: 'Simón Bolívar 4900',         phone: '+56912340019', email: 'natalia.ortiz@mock.cl' },
  { fullname: 'Tomás Espinoza Ríos',       address: 'Av. Matta 380',              phone: '+56912340020', email: 'tomas.espinoza@mock.cl' },
];

const MOCK_PRODUCTS = [
  { name: 'Aceite de Oliva',      description: 'Aceite de oliva extra virgen 500ml', quantity: 500, img: 'aceite-oliva.jpg',  code: 'MOCK-001' },
  { name: 'Miel de Abeja',        description: 'Miel pura de abeja 1kg',             quantity: 300, img: 'miel.jpg',          code: 'MOCK-002' },
  { name: 'Mermelada Artesanal',  description: 'Mermelada de frambuesa 400g',         quantity: 400, img: 'mermelada.jpg',     code: 'MOCK-003' },
  { name: 'Sal de Mar',           description: 'Sal de mar gruesa 1kg',               quantity: 600, img: 'sal-mar.jpg',       code: 'MOCK-004' },
  { name: 'Vinagre Balsámico',    description: 'Vinagre balsámico italiano 250ml',    quantity: 250, img: 'vinagre.jpg',       code: 'MOCK-005' },
];

// ─── Seed ────────────────────────────────────────────────────────────────────

async function getOrCreateProducts(): Promise<{ id: number }[]> {
  let products = await prisma.products.findMany({ where: { available: true }, select: { id: true } });

  if (products.length === 0) {
    console.log('⚠️  No hay productos. Creando productos mock...');
    for (const p of MOCK_PRODUCTS) {
      await prisma.products.create({ data: { ...p, available: true } });
    }
    products = await prisma.products.findMany({ where: { available: true }, select: { id: true } });
    console.log(`✅ ${products.length} productos mock creados`);
  }

  return products;
}

async function getCommuneIds(): Promise<number[]> {
  // Preferimos comunas de la Región Metropolitana; si no hay, cualquier comuna
  const rmRegion = await prisma.region.findFirst({ where: { name: { contains: 'Metropolitana' } } });
  const communes = await prisma.commune.findMany({
    where: rmRegion ? { regionId: rmRegion.id } : {},
    select: { id: true },
  });

  if (communes.length === 0) {
    console.log('⚠️  No hay comunas en la BD. Los clientes se crearán sin comuna.');
    return [];
  }

  return communes.map((c) => c.id);
}

async function applyFinalizePurchase(
  clientId: number,
  productsId: number,
  purchaseDate: Date,
  frequencyMap: Map<string, { lastDate: Date | null; purchaseCount: number; avgDays: number | null }>,
) {
  const key = `${clientId}-${productsId}`;
  const existing = frequencyMap.get(key) ?? { lastDate: null, purchaseCount: 0, avgDays: null };

  let avgDaysBetweenPurchases: number | null = null;
  let lastPurchaseDate: Date | null = existing.lastDate;
  let nextEstimatedDate: Date | null = null;
  let purchaseCount = existing.purchaseCount + 1;
  let status: FrequencyStatus = FrequencyStatus.NUEVO;

  if (existing.lastDate) {
    const diffDays = Math.round(
      (purchaseDate.getTime() - existing.lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    avgDaysBetweenPurchases = Math.max(diffDays, 1);
    nextEstimatedDate = new Date(purchaseDate.getTime() + avgDaysBetweenPurchases * 24 * 60 * 60 * 1000);
    status = FrequencyStatus.EN_PLAZO;
  }

  await (prisma as any).clientProductFrequency.upsert({
    where: { clientsId_productsId: { clientsId: clientId, productsId } },
    create: {
      clientsId: clientId,
      productsId,
      purchaseCount,
      avgDaysBetweenPurchases,
      lastPurchaseDate,
      actualPurchaseDate: purchaseDate,
      nextEstimatedDate,
      status,
    },
    update: {
      purchaseCount,
      avgDaysBetweenPurchases,
      lastPurchaseDate,
      actualPurchaseDate: purchaseDate,
      nextEstimatedDate,
      status,
    },
  });

  // Actualiza el map con el estado actual
  frequencyMap.set(key, { lastDate: purchaseDate, purchaseCount, avgDays: avgDaysBetweenPurchases });

  return avgDaysBetweenPurchases;
}

async function seedClientsMock() {
  const START = new Date('2026-01-01T00:00:00.000Z');
  const END   = new Date('2026-06-13T23:59:59.000Z');

  const [products, communeIds] = await Promise.all([getOrCreateProducts(), getCommuneIds()]);

  let createdClients = 0;
  let createdPurchases = 0;

  for (const clientData of MOCK_CLIENTS) {
    // Idempotencia: saltar si ya existe
    const existing = await prisma.clients.findFirst({ where: { email: clientData.email } });
    if (existing) {
      console.log(`⏭️  Cliente ${clientData.fullname} ya existe, omitiendo.`);
      continue;
    }

    // Crear cliente
    const communeId = communeIds.length > 0 ? pick(communeIds) : undefined;
    const client = await prisma.clients.create({
      data: {
        ...clientData,
        communeId: communeId ?? null,
        available: true,
        contactStatus: ContactStatus.LLAMAR,
      },
    });
    createdClients++;

    // Seleccionar 1-3 productos que comprará este cliente
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    const clientProducts = shuffled.slice(0, rInt(1, Math.min(3, products.length)));

    // Generar entre 5 y 20 compras distribuidas en los productos
    const totalPurchases = rInt(5, 20);
    const allPurchases: { productsId: number; purchaseDate: Date; quantity: number; unitPrice: number }[] = [];

    for (let i = 0; i < totalPurchases; i++) {
      allPurchases.push({
        productsId: pick(clientProducts).id,
        purchaseDate: randomDateInRange(START, END),
        quantity: rInt(1, 5),
        unitPrice: rInt(2000, 15000),
      });
    }

    // Ordenar cronológicamente para calcular frecuencia correctamente
    allPurchases.sort((a, b) => a.purchaseDate.getTime() - b.purchaseDate.getTime());

    // Map para trackear frecuencia por (clientId, productId)
    const frequencyMap = new Map<string, { lastDate: Date | null; purchaseCount: number; avgDays: number | null }>();
    let lastAvgDays: number | null = null;

    for (const p of allPurchases) {
      await prisma.buyByClient.create({
        data: {
          clientsId: client.id,
          productsId: p.productsId,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          purchaseDate: p.purchaseDate,
          purchaseStatus: PurchaseStatus.FINALIZADO,
        },
      });

      const avg = await applyFinalizePurchase(client.id, p.productsId, p.purchaseDate, frequencyMap);
      if (avg !== null) lastAvgDays = avg;

      createdPurchases++;
    }

    // Actualizar cliente con frecuencia y contactStatus final
    await prisma.clients.update({
      where: { id: client.id },
      data: {
        contactStatus: ContactStatus.CONTACTADO,
        ...(lastAvgDays !== null ? { frequency: lastAvgDays } : {}),
      },
    });

    console.log(`✅ ${clientData.fullname} — ${allPurchases.length} compras creadas`);
  }

  console.log(`\n✨ Seed completado: ${createdClients} clientes, ${createdPurchases} compras.`);
}

seedClientsMock()
  .then(async () => await prisma.$disconnect())
  .catch(async (error) => {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
