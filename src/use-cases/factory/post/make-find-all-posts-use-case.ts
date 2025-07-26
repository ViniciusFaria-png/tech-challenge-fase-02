import { PostRepository } from "@/repositories/pg/post.repository";
import { FindAllPostsUseCase } from "@/use-cases/factory/post/find-all-posts";

export function makeFindAllPostsUseCase() {
  const postRepository = new PostRepository();
  const findAllPostsUseCase = new FindAllPostsUseCase(postRepository);
  return findAllPostsUseCase;
}
