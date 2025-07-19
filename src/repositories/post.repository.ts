import { IPost } from "@/entities/models/post.interface";

export class PostRepository{
    async  searchQueryString(query: string): Promise<IPost>{

        return{
            id: "1",
            titulo: "titulo",
            resumo: "resumo",
            conteudo: "conteudo",
            professor_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
        }

    }
}