import { makeFindAllPostsUseCase } from "@/use-cases/factory/make-find-all-posts-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function findAll(request: FastifyRequest, reply: FastifyReply) {
  try {
    const findAllPostsUseCase = makeFindAllPostsUseCase();
    const { posts } = await findAllPostsUseCase.execute();

    return reply.status(200).send({ posts });
  } catch (err) {
    throw err;
  }
}
