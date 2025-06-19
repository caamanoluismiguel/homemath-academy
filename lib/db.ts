import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Ensure Prisma client is properly initialized
export async function initializePrisma() {
  try {
    await prisma.$connect()
    console.log('Prisma client connected successfully')
  } catch (error) {
    console.error('Failed to connect Prisma client:', error)
  }
}

