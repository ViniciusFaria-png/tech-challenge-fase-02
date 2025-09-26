import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { env } from "./env";
import { postRoutes } from "./http/controller/post/routes";
import { userRoutes } from "./http/controller/user/routes";
import { globalErrorHandler } from "./utils/global-error-handler";

export const app = fastify({
  logger: true,
});

app.register(fastifyCors, {
  origin: [
    "http://localhost:5173",  // Vite dev server
    "http://localhost:3000",  // Create React App
    "http://localhost:3001",  // Outras possíveis portas
    "http://127.0.0.1:5173",  // Localhost alternativo
    "https://teacher-post-challenge.vercel.app/"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Registrar JWT
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

// Usar fake auth apenas em desenvolvimento e quando não for produção
if (env.ENV !== "production") {
  // Comentar ou remover esta linha quando quiser testar com JWT real
  // app.register(fakeAuth);
}

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Blog dinamico API",
      description: "API for Tech Challenge",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Local server",
      },
    ],
    tags: [
      { name: "Posts", description: "Operations related to posts" },
      { name: "Auth", description: "Authentication operations" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

app.register(userRoutes);
app.register(postRoutes);

app.setErrorHandler(globalErrorHandler);

app.get("/", async (request, reply) => {
  return { status: "ok", message: "Servidor rodando!" };
});

app.ready((err) => {
  if (err) throw err;
  app.swagger();
  console.log(`Swagger docs available at http://localhost:${env.PORT}/docs`);
});
