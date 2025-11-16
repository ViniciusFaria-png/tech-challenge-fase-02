import { FastifyInstance } from "fastify";
import { create, createTeacherSchema } from "./create";
import { deleteProfessorSchema, remove } from "./delete";
import { findAll, findAllProfessorsSchema } from "./find-all";
import { findById } from "./find-by-id";
import { update, updateProfessorSchema } from "./update";

export async function teacherRoutes(app: FastifyInstance) {
  app.get("/teacher", { schema: findAllProfessorsSchema }, findAll);
  app.get("/teacher/:id", findById);
  app.post("/teacher", createTeacherSchema, create);
  app.put("/teacher/:id", { schema: updateProfessorSchema }, update);
  app.delete("/teacher/:id", { schema: deleteProfessorSchema }, remove);
}
