import { env } from "@/env";
import { Pool, PoolClient } from "pg";

const CONFIG = env.ENV === "production" ? {
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  family: 4,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
} : {
  user: env.POSTGRES_USER,
  host: env.POSTGRES_HOST || "localhost",
  database: env.POSTGRES_DB,
  password: env.POSTGRES_PASSWORD,
  port: env.POSTGRES_PORT || 5432,
  ssl: false,
};

export class Database {
  private pool: Pool;
  private client: PoolClient | undefined;

  constructor() {
    this.pool = new Pool(CONFIG);
    this.connection();
  }

  private async connection() {
    try {
      this.client ??= await this.pool.connect();
      console.log("Conexão com o banco de dados estabelecida com sucesso.");
      
      // Log para debug (sem mostrar senha)
      if (env.ENV === "production") {
        console.log("Usando Supabase em produção");
      } else {
        console.log(`Conectado ao banco local: ${env.POSTGRES_HOST}:${env.POSTGRES_PORT}`);
      }
    } catch (error) {
      console.error("Erro ao conectar ao banco de dados:", error);
      throw error;
    }
  }

  get clientInstance() {
    return this.client;
  }

  async query(text: string, params?: any[]) {
    if (!this.client) {
      await this.connection();
    }
    if (!this.client) {
      throw new Error("Cliente do banco não está conectado.");
    }
    return this.client.query(text, params);
  }

  // Método para fechar conexão
  async close() {
    if (this.client) {
      this.client.release();
    }
    await this.pool.end();
  }
}

export const db = new Database();