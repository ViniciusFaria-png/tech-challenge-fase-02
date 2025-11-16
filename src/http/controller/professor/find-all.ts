import { makeFindAllProfessorsUseCase } from "@/use-cases/factory/make-find-all-professors-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function findAll(request: FastifyRequest, reply: FastifyReply) {
  try {
    const findAllProfessorsUseCase = makeFindAllProfessorsUseCase();
    const { professors } = await findAllProfessorsUseCase.execute();

    return reply.status(200).send({ professors });
  } catch (err) {
    throw err;
  }
}

export const findAllProfessorsSchema = {
  summary: "Retrieve all professors",
  tags: ["Professors"],
  response: {
    200: {
      type: "object",
      properties: {
        professors: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              nome: { type: "string" },
              materia: { type: "string" },
              user_id: { type: "number" },
            },
          },
        },
      },
    },
    500: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};
