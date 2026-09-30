const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Crear Admin Bruno
  await prisma.usuario.upsert({
    where: { email: 'bruno@admin.com' },
    update: {},
    create: {
      nombre: 'Bruno Córdoba',
      email: 'bruno@admin.com',
      password: '123',
      rol: 'ADMIN'
    }
  });

  // Crear Admin Brenda
  await prisma.usuario.upsert({
    where: { email: 'brenda@admin.com' },
    update: {},
    create: {
      nombre: 'Brenda Córdoba',
      email: 'brenda@admin.com',
      password: '123',
      rol: 'ADMIN'
    }
  });

  console.log('✅ Administradores cargados correctamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });