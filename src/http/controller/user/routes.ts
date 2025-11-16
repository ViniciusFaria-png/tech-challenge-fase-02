import { FastifyInstance } from "fastify";
import { create } from "./create";
import { deleteUserSchema, remove } from "./delete";
import { findAll, findAllUsersSchema } from "./find-all";
import { findById, findUserByIdSchema } from "./find-by-id";
import { signin, signinSchema } from "./signin";
import { update, updateUserSchema } from "./update";

export async function userRoutes(app: FastifyInstance) {
  app.get("/user", { schema: findAllUsersSchema }, findAll);
  app.get("/user/:id", { schema: findUserByIdSchema }, findById);
  app.post("/user", create);
  app.post("/user/signin", { schema: signinSchema }, signin);
  app.put("/user/:id", { schema: updateUserSchema }, update);
  app.delete("/user/:id", { schema: deleteUserSchema }, remove);
}
