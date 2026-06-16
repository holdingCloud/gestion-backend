import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const COMPANIES = [
  {
    name: 'Distribuciones Norte S.A.',
    description: 'Empresa distribuidora con cobertura en la zona norte del país',
  },
  {
    name: 'Comercial Sur Ltda.',
    description: 'Comercializadora de productos con presencia en la zona sur',
  },
  {
    name: 'Inversiones del Pacífico SpA',
    description: 'Grupo inversor con operaciones en la región metropolitana y litoral',
  },
];

async function main() {
  console.log('Iniciando seed de empresas...');

  // Crear empresas que no existan aún (match por nombre)
  const companies: { id: number; name: string }[] = [];

  for (const data of COMPANIES) {
    const existing = await prisma.company.findFirst({ where: { name: data.name } });
    if (existing) {
      console.log(`  · Ya existe: ${data.name}`);
      companies.push(existing);
    } else {
      const created = await prisma.company.create({ data });
      console.log(`  + Creada: ${created.name} (id: ${created.id})`);
      companies.push(created);
    }
  }

  // Obtener IDs de todos los clientes activos
  const clients = await prisma.clients.findMany({
    where: { available: true },
    select: { id: true },
  });

  if (clients.length === 0) {
    console.log('No hay clientes activos para asignar.');
    return;
  }

  // Distribuir los IDs aleatoriamente entre las empresas
  const groups = new Map<number, number[]>(companies.map((c) => [c.id, []]));

  for (const client of clients) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    groups.get(company.id)!.push(client.id);
  }

  // Un updateMany por empresa — solo 3 queries en total
  for (const [companyId, clientIds] of groups.entries()) {
    if (clientIds.length === 0) continue;
    await prisma.clients.updateMany({
      where: { id: { in: clientIds } },
      data: { companyId },
    });
    const company = companies.find((c) => c.id === companyId)!;
    console.log(`  · ${company.name} → ${clientIds.length} clientes`);
  }

  console.log(`\nAsignación completada: ${clients.length} clientes actualizados.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
