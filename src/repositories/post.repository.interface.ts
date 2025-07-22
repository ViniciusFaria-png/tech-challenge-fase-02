import { IPost } from "@/entities/models/post.interface";

export interface IPostRepository {
  findAll(): Promise<IPost[]>;
  searchQueryString(query: string): Promise<IPost[]>;
}
