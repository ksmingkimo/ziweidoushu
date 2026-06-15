// Drizzle ORM 数据库连接
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// 通过环境变量获取数据库连接
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL && process.env.NODE_ENV !== 'test') {
  console.warn('DATABASE_URL not set — database features will not work');
}

// 创建 Neon HTTP 连接（适合 serverless/Vercel）
function createDb() {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  const sql = neon(DATABASE_URL);
  return drizzle(sql, { schema });
}

// 延迟初始化，避免在 build 时连接
let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

export { schema };
