import { FastifyInstance } from "fastify";
import { findAll } from "./find-all";
import { search } from "./search";

export async function postRoutes(app: FastifyInstance) {
  app.get("/search", search);
  app.get("/posts", findAll);
}
