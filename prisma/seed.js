const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Crear Admin (no requiere campos de Guia)
  const admin = await prisma.usuario.upsert({
    where: { email: 'bruno@admin.com' },
    update: {},
    create: {
      nombre: 'Bruno Córdoba',
      email: 'bruno@admin.com',
      password: '123',
      rol: 'ADMIN'
    }
  });

  console.log('✅ Admin creado/verificado:', admin.email);
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });