import { FastifyInstance } from "fastify";
import { create, createTeacherSchema } from "./create";
import { findById } from "./find-by-id";

export async function teacherRoutes(app: FastifyInstance) {
  app.post("/teacher", createTeacherSchema, create);
  app.get("/teacher/:id", findById);
}
