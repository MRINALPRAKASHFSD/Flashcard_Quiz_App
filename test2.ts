import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const libsql = createClient({ url: process.env.DATABASE_URL || 'file:./dev.db' });
console.log('DATABASE_URL is:', process.env.DATABASE_URL);
const adapter = new PrismaLibSql(libsql);
const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await prisma.question.count();
  console.log('Result count:', result);
}
main().catch(console.error);
