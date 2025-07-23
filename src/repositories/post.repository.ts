import { IPost } from "@/entities/models/post.interface";
import { db } from "@/lib/pg/db";

export class PostRepository{
   public  async  searchQueryString(query: string): Promise<IPost | undefined>{

        const result = await db.clientInstance?.query<IPost>(
            `SELECT * FROM post WHERE titulo ILIKE $1 OR conteudo ILIKE $1`,
            [`%${query}%`]      
        );

        return result?.rows[0] || undefined;
    }
}