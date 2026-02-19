import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type SeedUser = {
  email: string;
  fullName: string;
  password: string;
  imagen: string;
  type: 'ADMINISTRADOR' | 'REPARTIDOR' | 'COMUN';
};

const users: SeedUser[] = [
  {
    email: 'admin@local.test',
    fullName: 'Admin Principal',
    password: 'Admin1234',
    imagen: 'default-admin.png',
    type: 'ADMINISTRADOR',
  },
  {
    email: 'user@local.test',
    fullName: 'Usuario Comun',
    password: 'User1234',
    imagen: 'default-user.png',
    type: 'COMUN',
  },
];

async function main() {
  console.log('🌱 Iniciando seed de usuarios...');

  // Crear roles si no existen
  const roles = await prisma.roles.findMany();
  if (roles.length === 0) {
    const types: ('ADMINISTRADOR' | 'REPARTIDOR' | 'COMUN')[] = [
      'ADMINISTRADOR',
      'REPARTIDOR',
      'COMUN',
    ];
    for (const type of types) {
      await prisma.roles.create({ data: { type } });
      console.log(`✅ Rol ${type} creado`);
    }
  }

  // Crear usuarios
  for (const seedUser of users) {
    try {
      const existingUser = await prisma.users.findUnique({
        where: { email: seedUser.email },
      });

      if (existingUser) {
        console.log(`✅ Usuario ${seedUser.email} ya existe`);
        continue;
      }

      const role = await prisma.roles.findUnique({
        where: { type: seedUser.type },
      });

      if (!role) throw new Error(`Rol ${seedUser.type} no encontrado`);

      const passwordHash = await bcrypt.hash(seedUser.password, 10);

      const newUser = await prisma.users.create({
        data: {
          email: seedUser.email,
          fullName: seedUser.fullName,
          password: passwordHash,
          imagen: seedUser.imagen,
          rol: { connect: { id: role.id } },
          isActive: true,
          isLoged: false,
        },
        include: { rol: true },
      });

      console.log(
        `✅ Usuario ${newUser.email} creado con rol ${newUser.rol.type}`,
      );
    } catch (error) {
      console.error(
        `❌ Error:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  console.log('✨ Seed completado!');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (error) => {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  });