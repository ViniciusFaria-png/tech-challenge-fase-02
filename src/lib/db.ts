import { Pool, PoolClient} from 'pg';
import { env } from  "@/env"
import en from 'zod/v4/locales/en.cjs';

const CONFIG={
    user: env.POSTGRES_USER,
    host: env.POSTGRES_HOST,          
    database: env.POSTGRES_DB,
    password: env.POSTGRES_PASSWORD,
    port: env.POSTGRES_PORT
}

export class Database{
    
    private pool: Pool;
    private client: PoolClient | undefined;

    constructor() {
        this.pool = new Pool(CONFIG); 
        this.connection()
    }

    private async connection() {
        try{
            this.client ??= await this.pool.connect();
            console.log('Conexão com o banco de dados estabelecida com sucesso.');
        }  
        catch (error) {
            console.error('Error ao conectar ao banco de dados:', error);
            throw error;
        }
    } 


    get clientInstance() {
        return this.client
    }
}
   

export const db = new Database();