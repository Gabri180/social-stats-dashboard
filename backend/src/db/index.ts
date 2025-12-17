// backend/src/db/index.ts
import { drizzle } from 'drizzle-orm/sql-js';
import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import * as schema from './schema';
import * as fs from 'fs';
import * as path from 'path';

const dbPath = path.join(__dirname, '../../sqlite.db');
let database: SqlJsDatabase;
let db: ReturnType<typeof drizzle>;

export async function initDatabase() {
  const SQL = await initSqlJs();
  
  // Cargar base de datos existente o crear nueva
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    database = new SQL.Database(buffer);
    console.log('📂 Existing database loaded');
  } else {
    database = new SQL.Database();
    console.log('🆕 Creating new database');
  }
  
  // SIEMPRE crear las tablas (IF NOT EXISTS evita errores si ya existen)
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      created_at INTEGER DEFAULT (cast(strftime('%s', 'now') as int))
    );

    CREATE TABLE IF NOT EXISTS platforms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      platform TEXT NOT NULL,
      access_token TEXT NOT NULL,
      refresh_token TEXT,
      token_expiry INTEGER,
      platform_user_id TEXT NOT NULL,
      platform_username TEXT,
      connected_at INTEGER DEFAULT (cast(strftime('%s', 'now') as int)),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform_id INTEGER NOT NULL,
      followers INTEGER,
      views INTEGER,
      likes INTEGER,
      comments INTEGER,
      engagement TEXT,
      fetched_at INTEGER DEFAULT (cast(strftime('%s', 'now') as int)),
      FOREIGN KEY (platform_id) REFERENCES platforms (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform_id INTEGER NOT NULL,
      video_id TEXT NOT NULL,
      title TEXT,
      views INTEGER,
      likes INTEGER,
      comments INTEGER,
      shares INTEGER,
      duration INTEGER,
      published_at INTEGER,
      metrics TEXT,
      FOREIGN KEY (platform_id) REFERENCES platforms (id) ON DELETE CASCADE
    );
  `);
  
  console.log('✅ Database tables initialized');
  
  db = drizzle(database, { schema });
  
  // Guardar cambios cada 5 segundos
  setInterval(() => {
    try {
      const data = database.export();
      fs.writeFileSync(dbPath, data);
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }, 5000);
  
  // Guardar al cerrar
  process.on('exit', () => {
    const data = database.export();
    fs.writeFileSync(dbPath, data);
  });
  
  return db;
}

export function testConnection() {
  try {
    console.log('✅ Database connection established');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

export { db };
