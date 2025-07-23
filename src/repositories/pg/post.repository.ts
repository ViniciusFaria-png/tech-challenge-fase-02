import { IPost } from "@/entities/models/post.interface";
import { db } from "@/lib/db";
import { IPostRepository } from "../post.repository.interface";

export class PostRepository implements IPostRepository {
  //async create(): Ana TODO 
  async findAll(): Promise<IPost[]> {
    const result = await db.clientInstance?.query<IPost>(
      `SELECT id, titulo, resumo, conteudo, professor_id, created_at, updated_at FROM post`
    );
    return result?.rows || [];
  }
  //async findById(): Vitor TODO
  //async update(): Ana TODO
  //async delete(): Vitor TODO
  public async searchQueryString(query: string): Promise<IPost[]> {
    const result = await db.clientInstance?.query<IPost>(
      `SELECT * FROM post WHERE titulo ILIKE $1 OR conteudo ILIKE $1`,
      [`%${query}%`]
    );

    return result?.rows || [];
  }
}
