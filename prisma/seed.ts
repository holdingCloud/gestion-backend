import { PrismaClient, Modulo } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type SeedUser = {
  email: string;
  fullName: string;
  password: string;
  imagen: string;
  type: 'SUPER_ADMIN' | 'ADMINISTRADOR' | 'REPARTIDOR' | 'COMUN';
};

const users: SeedUser[] = [
  {
    email: 'superadmin@local.test',
    fullName: 'Super Administrador',
    password: 'Super1234',
    imagen: 'default-admin.png',
    type: 'SUPER_ADMIN',
  },
  {
    email: 'admin@local.test',
    fullName: 'Admin Principal',
    password: 'Admin1234',
    imagen: 'default-admin.png',
    type: 'ADMINISTRADOR',
  }
];

const regionsData = [
  {
    name: 'Región de Arica y Parinacota',
    communes: ['Arica', 'Camarones', 'Putre', 'General Lagos'],
  },
  {
    name: 'Región de Tarapacá',
    communes: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'],
  },
  {
    name: 'Región de Antofagasta',
    communes: [
      'Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal',
      'Calama', 'Ollagüe', 'San Pedro de Atacama',
      'Tocopilla', 'María Elena',
    ],
  },
  {
    name: 'Región de Atacama',
    communes: [
      'Copiapó', 'Caldera', 'Tierra Amarilla',
      'Chañaral', 'Diego de Almagro',
      'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco',
    ],
  },
  {
    name: 'Región de Coquimbo',
    communes: [
      'La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña',
      'Illapel', 'Canela', 'Los Vilos', 'Salamanca',
      'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado',
    ],
  },
  {
    name: 'Región de Valparaíso',
    communes: [
      'Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar',
      'Isla de Pascua',
      'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban',
      'La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar',
      'Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales',
      'San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo',
      'San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María',
      'Limache', 'Olmué', 'Quilpué', 'Villa Alemana',
    ],
  },
  {
    name: 'Región Metropolitana de Santiago',
    communes: [
      'Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central',
      'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana',
      'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú',
      'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura',
      'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura',
      'Puente Alto', 'Pirque', 'San José de Maipo',
      'Colina', 'Lampa', 'Tiltil',
      'San Bernardo', 'Buin', 'Calera de Tango', 'Paine',
      'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro',
      'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor',
    ],
  },
  {
    name: "Región del Libertador General Bernardo O'Higgins",
    communes: [
      'Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras',
      'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco',
      'Rengo', 'Requínoa', 'San Vicente',
      'Pichilemu', 'La Estrella', 'Litueche', 'Marchigüe', 'Navidad', 'Paredones',
      'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla',
      'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz',
    ],
  },
  {
    name: 'Región del Maule',
    communes: [
      'Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue',
      'Río Claro', 'San Clemente', 'San Rafael',
      'Cauquenes', 'Chanco', 'Pelluhue',
      'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén',
      'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas',
    ],
  },
  {
    name: 'Región de Ñuble',
    communes: [
      'Chillán', 'Bulnes', 'Cobquecura', 'Coelemu', 'Coihueco', 'Chillán Viejo', 'El Carmen',
      'Ninhue', 'Ñiquén', 'Pemuco', 'Pinto', 'Portezuelo', 'Quillón', 'Quirihue', 'Ránquil',
      'San Carlos', 'San Fabián', 'San Ignacio', 'San Nicolás', 'Treguaco', 'Yungay',
    ],
  },
  {
    name: 'Región del Biobío',
    communes: [
      'Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualqui', 'Lota', 'Penco',
      'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Hualpén',
      'Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa',
      'Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete',
      'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío',
    ],
  },
  {
    name: 'Región de La Araucanía',
    communes: [
      'Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro',
      'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén',
      'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Cholchol',
      'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco',
      'Purén', 'Renaico', 'Traiguén', 'Victoria',
    ],
  },
  {
    name: 'Región de Los Ríos',
    communes: [
      'Valdivia', 'Corral', 'Futrono', 'La Unión', 'Lago Ranco', 'Lanco', 'Los Lagos',
      'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'Río Bueno',
    ],
  },
  {
    name: 'Región de Los Lagos',
    communes: [
      'Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue',
      'Maullín', 'Puerto Varas',
      'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón',
      'Queilén', 'Quellón', 'Quemchi', 'Quinchao',
      'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo',
      'Chaitén', 'Futaleufú', 'Hualaihué', 'Palena',
    ],
  },
  {
    name: 'Región de Aysén del General Carlos Ibáñez del Campo',
    communes: [
      'Coyhaique', 'Lago Verde',
      'Aysén', 'Cisnes', 'Guaitecas',
      'Cochrane', "O'Higgins", 'Tortel',
      'Chile Chico', 'Río Ibáñez',
    ],
  },
  {
    name: 'Región de Magallanes y de la Antártica Chilena',
    communes: [
      'Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio',
      'Cabo de Hornos', 'Antártica',
      'Porvenir', 'Primavera', 'Timaukel',
      'Natales', 'Torres del Paine',
    ],
  },
];

async function seedRoles() {
  const types: ('SUPER_ADMIN' | 'ADMINISTRADOR' | 'REPARTIDOR' | 'COMUN')[] = [
    'SUPER_ADMIN',
    'ADMINISTRADOR',
    'REPARTIDOR',
    'COMUN',
  ];
  for (const type of types) {
    await prisma.roles.upsert({
      where: { type },
      create: { type },
      update: {},
    });
    console.log(`✅ Rol ${type} creado/verificado`);
  }
}

async function seedUsers() {
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
}

async function seedRegionsAndCommunes() {
  const existing = await prisma.region.count();
  if (existing > 0) {
    console.log('✅ Regiones y comunas ya existen, omitiendo seed.');
    return;
  }

  for (const regionData of regionsData) {
    const region = await prisma.region.create({
      data: {
        name: regionData.name,
        communes: {
          create: regionData.communes.map((name) => ({ name })),
        },
      },
    });
    console.log(`✅ Región creada: ${region.name} (${regionData.communes.length} comunas)`);
  }
}

const modulosPorRol: Record<string, Modulo[]> = {
  SUPER_ADMIN: [
    Modulo.DASHBOARD, Modulo.USUARIOS, Modulo.CLIENTES, Modulo.RRHH,
    Modulo.INVENTARIO, Modulo.COMPRAS, Modulo.PROVEEDORES, Modulo.CUENTAS,
    Modulo.HOJA_DE_VENTA, Modulo.REPORTES, Modulo.EMPRESAS,
  ],
  ADMINISTRADOR: [
    Modulo.DASHBOARD, Modulo.USUARIOS, Modulo.CLIENTES, Modulo.RRHH,
    Modulo.INVENTARIO, Modulo.COMPRAS, Modulo.PROVEEDORES, Modulo.CUENTAS,
    Modulo.HOJA_DE_VENTA, Modulo.REPORTES, Modulo.EMPRESAS,
  ],
  REPARTIDOR: [Modulo.HOJA_DE_VENTA],
  COMUN:      [Modulo.CLIENTES, Modulo.HOJA_DE_VENTA],
};

async function seedRolModulos() {
  for (const [type, modulos] of Object.entries(modulosPorRol)) {
    const rol = await prisma.roles.findUnique({ where: { type: type as any } });
    if (!rol) continue;
    await prisma.$transaction(async (tx) => {
      await tx.rolModulo.deleteMany({ where: { rolId: rol.id } });
      await tx.rolModulo.createMany({
        data: modulos.map((modulo) => ({ rolId: rol.id, modulo })),
      });
    });
    console.log(`✅ Módulos asignados a ${type}: ${modulos.join(', ')}`);
  }
}

async function main() {
  console.log('🌱 Iniciando seed...');

  await seedRoles();
  await seedRolModulos();
  await seedUsers();

  console.log('🌱 Iniciando seed de regiones y comunas...');
  await seedRegionsAndCommunes();

  const totalRegions = await prisma.region.count();
  const totalCommunes = await prisma.commune.count();
  console.log(`✨ Seed completado! ${totalRegions} regiones, ${totalCommunes} comunas.`);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (error) => {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  });