import { IPost } from "@/entities/models/post.interface";
import { db } from "@/lib/db";

export class PostRepository {
  async findAll(): Promise<IPost[]> {
    const result = await db.clientInstance?.query<IPost>(
      `SELECT id, titulo, resumo, conteudo, professor_id, created_at, updated_at FROM post`
    );
    return result?.rows || [];
  }

  async searchQueryString(query: string): Promise<IPost[]> {
    const result = await db.clientInstance?.query<IPost>(
      `SELECT id, titulo, resumo, conteudo, professor_id, created_at, updated_at
       FROM post
       WHERE titulo ILIKE $1 OR conteudo ILIKE $1`,
      [`%${query}%`]
    );
    return result?.rows || [];
  }
}
