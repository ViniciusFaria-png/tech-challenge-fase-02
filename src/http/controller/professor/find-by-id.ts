import { makeFindProfessorByIdUseCase } from "@/use-cases/factory/make-find-professor-by-id-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceNotFoundError } from "../../../use-cases/errors/resource-not-found-error";

export async function findById(request: FastifyRequest, reply: FastifyReply) {
  const findProfessorByIdParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = findProfessorByIdParamsSchema.parse(request.params);

  try {
    const findProfessorByIdUseCase = makeFindProfessorByIdUseCase();
    const { professor } = await findProfessorByIdUseCase.execute({ id });

    return reply.status(200).send({ professor });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}