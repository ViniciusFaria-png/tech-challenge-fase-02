import { IPost } from "@/entities/models/post.interface";

export interface IPostRepository {
  //create(): Ana TODO
  // findById(): Vitor TODO
    findAll(): Promise<IPost[]>;
    // update(): Ana TODO
  // delete(): Vitor TODO
  searchQueryString(query: string): Promise<IPost[]>;
}
