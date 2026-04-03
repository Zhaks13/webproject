require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDB() {
    try {
        const deletedProducts = await prisma.product.deleteMany({
            where: {
                image: {
                    startsWith: 'file://',
                },
            },
        });
        console.log(`Successfully deleted ${deletedProducts.count} invalid products.`);
    } catch (error) {
        console.error('Error cleaning database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanDB().then(() => process.exit(0)).catch(() => process.exit(1));
