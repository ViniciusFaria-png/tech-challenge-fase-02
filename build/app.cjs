"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_jwt = __toESM(require("@fastify/jwt"), 1);
var import_swagger = __toESM(require("@fastify/swagger"), 1);
var import_swagger_ui = __toESM(require("@fastify/swagger-ui"), 1);
var import_fastify = __toESM(require("fastify"), 1);

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  ENV: import_zod.z.enum(["development", "production", "test"]).default("development"),
  PORT: import_zod.z.coerce.number().default(3e3),
  POSTGRES_DB: import_zod.z.string(),
  POSTGRES_USER: import_zod.z.string(),
  POSTGRES_PASSWORD: import_zod.z.string(),
  POSTGRES_HOST: import_zod.z.string().default("db"),
  POSTGRES_PORT: import_zod.z.coerce.number(),
  JWT_SECRET: import_zod.z.string()
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables");
}
var env = _env.data;

// src/http/middleware/professor-auth.ts
function professorAuth(request, reply) {
  return __async(this, null, function* () {
    try {
      yield request.jwtVerify();
      const payload = request.user;
      if (!payload.isProfessor || !payload.professorId) {
        return reply.status(403).send({
          message: "Acesso negado. Apenas professores podem realizar esta a\xE7\xE3o."
        });
      }
      request.user = {
        id: payload.sub,
        email: payload.email,
        professor_id: payload.professorId.toString()
      };
    } catch (error) {
      return reply.status(401).send({
        message: "Token inv\xE1lido ou expirado"
      });
    }
  });
}

// src/lib/db.ts
var import_pg = require("pg");
var CONFIG = {
  user: env.POSTGRES_USER,
  host: env.POSTGRES_HOST,
  database: env.POSTGRES_DB,
  password: env.POSTGRES_PASSWORD,
  port: env.POSTGRES_PORT,
  ssl: env.ENV === "production" ? { rejectUnauthorized: false } : false
};
var Database = class {
  constructor() {
    this.pool = new import_pg.Pool(CONFIG);
    this.connection();
  }
  connection() {
    return __async(this, null, function* () {
      var _a;
      try {
        (_a = this.client) != null ? _a : this.client = yield this.pool.connect();
        console.log("Conex\xE3o com o banco de dados estabelecida com sucesso.");
      } catch (error) {
        console.error("Error ao conectar ao banco de dados:", error);
        throw error;
      }
    });
  }
  get clientInstance() {
    return this.client;
  }
  query(text, params) {
    return __async(this, null, function* () {
      if (!this.client) {
        yield this.connection();
      }
      if (!this.client) {
        throw new Error("Cliente do banco n\xE3o est\xE1 conectado.");
      }
      return this.client.query(text, params);
    });
  }
};
var db = new Database();

// src/repositories/pg/post.repository.ts
var PostRepository = class {
  create(data) {
    return __async(this, null, function* () {
      var _a;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `INSERT INTO post (titulo, resumo, conteudo, professor_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, titulo, resumo, conteudo, professor_id, created_at, updated_at`,
        [data.titulo, data.resumo, data.conteudo, data.professor_id]
      );
      return result == null ? void 0 : result.rows[0];
    });
  }
  findAll() {
    return __async(this, null, function* () {
      var _a;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `SELECT id, titulo, resumo, conteudo, professor_id, created_at, updated_at FROM post`
      );
      return (result == null ? void 0 : result.rows) || [];
    });
  }
  findById(id) {
    return __async(this, null, function* () {
      var _a;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `SELECT id, titulo, resumo, conteudo, professor_id, created_at, updated_at FROM post WHERE id = $1`,
        [id]
      );
      return result == null ? void 0 : result.rows[0];
    });
  }
  update(id, data) {
    return __async(this, null, function* () {
      var _a;
      const fields = [];
      const values = [];
      let paramIndex = 1;
      if (data.titulo !== void 0) {
        fields.push(`titulo = $${paramIndex++}`);
        values.push(data.titulo);
      }
      if (data.resumo !== void 0) {
        fields.push(`resumo = $${paramIndex++}`);
        values.push(data.resumo);
      }
      if (data.conteudo !== void 0) {
        fields.push(`conteudo = $${paramIndex++}`);
        values.push(data.conteudo);
      }
      if (data.professor_id !== void 0) {
        fields.push(`professor_id = $${paramIndex++}`);
        values.push(data.professor_id);
      }
      fields.push(`updated_at = NOW()`);
      values.push(id);
      if (fields.length === 0) {
        return this.findById(id);
      }
      const setClause = fields.join(", ");
      const query = `UPDATE post SET ${setClause} WHERE id = $${paramIndex} RETURNING id, titulo, resumo, conteudo, professor_id, created_at, updated_at`;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(query, values);
      return result == null ? void 0 : result.rows[0];
    });
  }
  delete(id) {
    return __async(this, null, function* () {
      var _a;
      yield (_a = db.clientInstance) == null ? void 0 : _a.query(`DELETE FROM post WHERE id = $1`, [id]);
    });
  }
  searchQueryString(query) {
    return __async(this, null, function* () {
      var _a;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `SELECT * FROM post WHERE titulo ILIKE $1 OR conteudo ILIKE $1`,
        [`%${query}%`]
      );
      return (result == null ? void 0 : result.rows) || [];
    });
  }
};

// src/use-cases/create-post.ts
var CreatePostUseCase = class {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      titulo,
      resumo,
      conteudo,
      professor_id
    }) {
      const post = yield this.postRepository.create({
        titulo,
        resumo,
        conteudo,
        professor_id
      });
      if (!post) {
        throw new Error("Failed to create post.");
      }
      return {
        post
      };
    });
  }
};

// src/use-cases/factory/make-create-post-use-case.ts
function makeCreatePostUseCase() {
  const postRepository = new PostRepository();
  const useCase = new CreatePostUseCase(postRepository);
  return useCase;
}

// src/http/controller/post/create.ts
var import_zod2 = require("zod");
var createPostBodySchema = import_zod2.z.object({
  titulo: import_zod2.z.string().min(1, "Title is required."),
  resumo: import_zod2.z.string().optional(),
  conteudo: import_zod2.z.string().min(1, "Content is required.")
});
function create(request, reply) {
  return __async(this, null, function* () {
    var _a;
    try {
      const { titulo, resumo, conteudo } = createPostBodySchema.parse(
        request.body
      );
      const professor_id = parseInt(((_a = request.user) == null ? void 0 : _a.professor_id) || "0");
      if (!professor_id) {
        return reply.status(401).send({ message: "User not authenticated or invalid professor ID" });
      }
      const createPostUseCase = makeCreatePostUseCase();
      const { post } = yield createPostUseCase.execute({
        titulo,
        resumo,
        conteudo,
        professor_id
      });
      return reply.status(201).send({ post });
    } catch (err) {
      if (err instanceof import_zod2.z.ZodError) {
        return reply.status(400).send({
          message: "Validation error.",
          issues: err.issues
        });
      }
      throw err;
    }
  });
}
var createPostSchema = {
  summary: "Create a new post",
  tags: ["Posts"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    properties: {
      titulo: { type: "string", minLength: 1 },
      resumo: { type: "string" },
      conteudo: { type: "string", minLength: 1 }
    },
    required: ["titulo", "conteudo"]
  },
  response: {
    201: {
      type: "object",
      properties: {
        post: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Generated UUID for the post"
            },
            titulo: { type: "string" },
            resumo: { type: "string", nullable: true },
            conteudo: { type: "string" },
            professor_id: { type: "number", format: "int32" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          },
          required: [
            "id",
            "titulo",
            "conteudo",
            "professor_id",
            "created_at",
            "updated_at"
          ]
        }
      }
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string", example: "Validation error." },
        issues: {
          type: "object",
          description: "Details about validation errors"
        }
      }
    },
    401: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Token inv\xE1lido ou expirado"
        }
      }
    },
    403: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Acesso negado. Apenas professores podem realizar esta a\xE7\xE3o."
        }
      }
    }
  }
};

// src/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
  }
};

// src/use-cases/delete-post.ts
var DeletePostUseCase = class {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      postId
    }) {
      const postExists = yield this.postRepository.findById(postId);
      if (!postExists) {
        throw new ResourceNotFoundError();
      }
      yield this.postRepository.delete(postId);
    });
  }
};

// src/use-cases/factory/make-delete-post-use-case.ts
function makeDeletePostUseCase() {
  const postRepository = new PostRepository();
  const useCase = new DeletePostUseCase(postRepository);
  return useCase;
}

// src/http/controller/post/delete.ts
var import_zod3 = require("zod");
var deletePostParamsSchema = import_zod3.z.object({
  id: import_zod3.z.string().uuid("Invalid post ID format.")
});
function remove(request, reply) {
  return __async(this, null, function* () {
    try {
      const { id } = deletePostParamsSchema.parse(request.params);
      const deletePostUseCase = makeDeletePostUseCase();
      yield deletePostUseCase.execute({ postId: id });
      return reply.status(204).send();
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return reply.status(404).send({ message: err.message });
      }
      if (err instanceof import_zod3.z.ZodError) {
        return reply.status(400).send({
          message: "Validation error.",
          issues: err.issues
        });
      }
      throw err;
    }
  });
}
var deletePostSchema = {
  summary: "Delete a post by ID",
  tags: ["Posts"],
  params: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" }
    },
    required: ["id"]
  },
  response: {
    204: {
      type: "null",
      description: "No content"
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string", example: "Validation error." },
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              code: { type: "string" },
              expected: { type: "string" },
              received: { type: "string" },
              path: { type: "array", items: { type: "string" } },
              message: { type: "string" }
            },
            required: ["code", "expected", "received", "path", "message"]
          }
        }
      }
    },
    404: {
      type: "object",
      properties: {
        message: { type: "string", example: "Resource not found" }
      }
    }
  }
};

// src/use-cases/find-all-posts.ts
var FindAllPostsUseCase = class {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }
  execute() {
    return __async(this, null, function* () {
      const posts = yield this.postRepository.findAll();
      return {
        posts
      };
    });
  }
};

// src/use-cases/factory/make-find-all-posts-use-case.ts
function makeFindAllPostsUseCase() {
  const postRepository = new PostRepository();
  const findAllPostsUseCase = new FindAllPostsUseCase(postRepository);
  return findAllPostsUseCase;
}

// src/http/controller/post/find-all.ts
function findAll(request, reply) {
  return __async(this, null, function* () {
    try {
      const findAllPostsUseCase = makeFindAllPostsUseCase();
      const { posts } = yield findAllPostsUseCase.execute();
      return reply.status(200).send({ posts });
    } catch (err) {
      throw err;
    }
  });
}
var findAllPostsSchema = {
  summary: "Retrieve all posts",
  tags: ["Posts"],
  response: {
    200: {
      type: "object",
      properties: {
        posts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              titulo: { type: "string" },
              resumo: { type: "string", nullable: true },
              conteudo: { type: "string" },
              professor_id: { type: "number" },
              created_at: { type: "string", format: "date-time" },
              updated_at: { type: "string", format: "date-time" }
            }
          }
        }
      }
    },
    500: {
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  }
};

// src/use-cases/find-post-by-id.ts
var FindPostByIdUseCase = class {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }
  execute(_0) {
    return __async(this, arguments, function* ({
      postId
    }) {
      const post = yield this.postRepository.findById(postId);
      if (!post) {
        throw new ResourceNotFoundError();
      }
      return {
        post
      };
    });
  }
};

// src/use-cases/factory/make-find-post-by-id-use-case.ts
function makeFindPostByIdUseCase() {
  const postRepository = new PostRepository();
  const useCase = new FindPostByIdUseCase(postRepository);
  return useCase;
}

// src/http/controller/post/find-by-id.ts
var import_zod4 = require("zod");
var findPostParamsSchema = import_zod4.z.object({
  id: import_zod4.z.string().uuid("Invalid post ID format.")
});
function findById(request, reply) {
  return __async(this, null, function* () {
    try {
      const { id } = findPostParamsSchema.parse(request.params);
      const findPostByIdUseCase = makeFindPostByIdUseCase();
      const { post } = yield findPostByIdUseCase.execute({ postId: id });
      return reply.status(200).send({ post });
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return reply.status(404).send({ message: err.message });
      }
      if (err instanceof import_zod4.z.ZodError) {
        return reply.status(400).send({
          message: "Validation error.",
          issues: err.issues
        });
      }
      throw err;
    }
  });
}
var findByIdPostSchema = {
  summary: "Get a post by ID",
  tags: ["Posts"],
  params: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" }
    },
    required: ["id"]
  },
  response: {
    200: {
      type: "object",
      properties: {
        post: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Generated UUID for the post"
            },
            titulo: { type: "string" },
            resumo: { type: "string", nullable: true },
            conteudo: { type: "string" },
            professor_id: { type: "number", format: "int32" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          },
          required: [
            "id",
            "titulo",
            "conteudo",
            "professor_id",
            "created_at",
            "updated_at"
          ]
        }
      }
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string", example: "Validation error." },
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              code: { type: "string" },
              expected: { type: "string" },
              received: { type: "string" },
              path: { type: "array", items: { type: "string" } },
              message: { type: "string" }
            },
            required: ["code", "expected", "received", "path", "message"]
          }
        }
      }
    },
    404: {
      type: "object",
      properties: {
        message: { type: "string", example: "Resource not found" }
      }
    }
  }
};

// src/use-cases/search-post.ts
var SearchQueryStringUseCase = class {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }
  handler(query) {
    return this.postRepository.searchQueryString(query);
  }
};

// src/http/controller/post/search.ts
var import_zod5 = require("zod");
function search(request, reply) {
  return __async(this, null, function* () {
    const registerQuerySchema = import_zod5.z.object({
      query: import_zod5.z.string().min(1, "Query parameter is required")
    });
    try {
      const { query } = registerQuerySchema.parse(request.query);
      const postRepository = new PostRepository();
      const createSearchUseCase = new SearchQueryStringUseCase(postRepository);
      const post = yield createSearchUseCase.handler(query);
      if (!post || Array.isArray(post) && post.length === 0) {
        return reply.status(404).send();
      }
      return reply.status(200).send(post);
    } catch (err) {
      if (err instanceof import_zod5.z.ZodError) {
        return reply.status(400).send({
          error: "Invalid query parameter",
          details: err.issues
        });
      }
      console.error("Search error:", err);
      return reply.status(500).send();
    }
  });
}

// src/use-cases/update-post.ts
var UpdatePostUseCase = class {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }
  execute(_a) {
    return __async(this, null, function* () {
      var _b = _a, {
        postId
      } = _b, data = __objRest(_b, [
        "postId"
      ]);
      const post = yield this.postRepository.update(postId, data);
      if (!post) {
        throw new ResourceNotFoundError();
      }
      return {
        post
      };
    });
  }
};

// src/use-cases/factory/make-update-post-use-case.ts
function makeUpdatePostUseCase() {
  const postRepository = new PostRepository();
  const useCase = new UpdatePostUseCase(postRepository);
  return useCase;
}

// src/http/controller/post/update.ts
var import_zod6 = require("zod");
var updatePostParamsSchema = import_zod6.z.object({
  id: import_zod6.z.string().uuid("Invalid post ID format.")
});
var updatePostBodySchema = import_zod6.z.object({
  titulo: import_zod6.z.string().min(1, "Title cannot be empty.").optional(),
  resumo: import_zod6.z.string().optional(),
  conteudo: import_zod6.z.string().min(1, "Content cannot be empty.").optional(),
  professor_id: import_zod6.z.number().int().positive().optional()
}).partial();
function update(request, reply) {
  return __async(this, null, function* () {
    try {
      const { id } = updatePostParamsSchema.parse(request.params);
      const data = updatePostBodySchema.parse(request.body);
      const updatePostUseCase = makeUpdatePostUseCase();
      const { post } = yield updatePostUseCase.execute(__spreadValues({
        postId: id
      }, data));
      return reply.status(200).send({ post });
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return reply.status(404).send({ message: err.message });
      }
      if (err instanceof import_zod6.z.ZodError) {
        return reply.status(400).send({
          message: "Validation error.",
          issues: err.issues
        });
      }
      throw err;
    }
  });
}
var updatePostSchema = {
  summary: "Update a post by ID",
  tags: ["Posts"],
  params: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" }
    },
    required: ["id"]
  },
  body: {
    type: "object",
    properties: {
      titulo: { type: "string", minLength: 1 },
      resumo: { type: "string" },
      conteudo: { type: "string", minLength: 1 },
      professor_id: { type: "number", minimum: 1 }
    },
    minProperties: 1
  },
  response: {
    200: {
      type: "object",
      properties: {
        post: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Generated UUID for the post"
            },
            titulo: { type: "string" },
            resumo: { type: "string", nullable: true },
            conteudo: { type: "string" },
            professor_id: { type: "number", format: "int32" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          },
          required: [
            "id",
            "titulo",
            "conteudo",
            "professor_id",
            "created_at",
            "updated_at"
          ]
        }
      }
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string", example: "Validation error." },
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              code: { type: "string" },
              expected: { type: "string" },
              received: { type: "string" },
              path: { type: "array", items: { type: "string" } },
              message: { type: "string" }
            },
            required: ["code", "expected", "received", "path", "message"]
          }
        }
      }
    },
    404: {
      type: "object",
      properties: {
        message: { type: "string", example: "Resource not found" }
      }
    }
  }
};

// src/http/controller/post/routes.ts
function postRoutes(app2) {
  return __async(this, null, function* () {
    app2.get("/posts/search", search);
    app2.get("/posts/:id", { schema: findByIdPostSchema }, findById);
    app2.get("/posts", { schema: findAllPostsSchema }, findAll);
    app2.post(
      "/posts",
      {
        preHandler: [professorAuth],
        schema: createPostSchema
      },
      create
    );
    app2.put(
      "/posts/:id",
      {
        preHandler: [professorAuth],
        schema: updatePostSchema
      },
      update
    );
    app2.delete(
      "/posts/:id",
      {
        preHandler: [professorAuth],
        schema: deletePostSchema
      },
      remove
    );
  });
}

// src/repositories/pg/user.repository.ts
var UserRepository = class {
  signin(email) {
    return __async(this, null, function* () {
      var _a;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `
      SELECT * FROM "user"
      WHERE "user".email = $1
      `,
        [email]
      );
      return result == null ? void 0 : result.rows[0];
    });
  }
  create(_0) {
    return __async(this, arguments, function* ({ email, senha }) {
      var _a;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `
      INSERT INTO "user" (email, senha) VALUES($1, $2) RETURNING *
      `,
        [email, senha]
      );
      return result == null ? void 0 : result.rows[0];
    });
  }
};

// src/use-cases/create-user.ts
var import_bcryptjs = require("bcryptjs");
var CreateUserUseCase = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  handler(user) {
    return __async(this, null, function* () {
      const { email, senha } = user;
      const hashedPassword = yield (0, import_bcryptjs.hash)(senha, 8);
      const newUser = yield this.userRepository.create({
        email,
        senha: hashedPassword
      });
      return newUser;
    });
  }
};

// src/use-cases/factory/make-create-user-use-case.ts
function makeCreateUserUseCase() {
  const userRepository = new UserRepository();
  const createUserUseCase = new CreateUserUseCase(userRepository);
  return createUserUseCase;
}

// src/http/controller/user/create.ts
var import_zod7 = require("zod");
function create2(request, reply) {
  return __async(this, null, function* () {
    const registerBodySchema = import_zod7.z.object({
      email: import_zod7.z.string().email(),
      senha: import_zod7.z.string().min(6)
    });
    const { email, senha } = registerBodySchema.parse(request.body);
    const createUserUseCase = makeCreateUserUseCase();
    const user = yield createUserUseCase.handler({ email, senha });
    return reply.status(201).send({ id: user == null ? void 0 : user.id, email: user == null ? void 0 : user.email });
  });
}

// src/repositories/pg/professor.repository.ts
var ProfessorRepository = class {
  create(_0) {
    return __async(this, arguments, function* ({ nome, materia, user_id }) {
      var _a;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `
      INSERT INTO "professor" (nome, materia, user_id) VALUES ($1, $2, $3) RETURNING *
      `,
        [nome, materia, user_id]
      );
      return result == null ? void 0 : result.rows[0];
    });
  }
  getName(id) {
    return __async(this, null, function* () {
      var _a;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `
      SELECT nome FROM professor WHERE professor.user_id = $1
      `,
        [id]
      );
      const nome = result == null ? void 0 : result.rows[0].nome;
      return nome;
    });
  }
  getProfessorId(userId) {
    return __async(this, null, function* () {
      var _a, _b;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `
      SELECT id FROM professor WHERE professor.user_id = $1
      `,
        [userId]
      );
      return (_b = result == null ? void 0 : result.rows[0]) == null ? void 0 : _b.id;
    });
  }
  findByUserId(userId) {
    return __async(this, null, function* () {
      var _a;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `
      SELECT * FROM professor WHERE professor.user_id = $1
      `,
        [userId]
      );
      return (result == null ? void 0 : result.rows[0]) || null;
    });
  }
};

// src/use-cases/find-professor-by-name.ts
var FindProfessorByNameUseCase = class {
  constructor(professorRepository) {
    this.professorRepository = professorRepository;
  }
  handler(id) {
    return __async(this, null, function* () {
      return this.professorRepository.getName(id);
    });
  }
  getProfessorId(userId) {
    return __async(this, null, function* () {
      return this.professorRepository.getProfessorId(userId);
    });
  }
  findByUserId(userId) {
    return __async(this, null, function* () {
      return this.professorRepository.findByUserId(userId);
    });
  }
};

// src/use-cases/factory/make-find-professor-by-name-use-case.ts
function makeFindProfessorByNameUseCase() {
  const professorRepository = new ProfessorRepository();
  const findProfessorByNameUseCase = new FindProfessorByNameUseCase(
    professorRepository
  );
  return findProfessorByNameUseCase;
}

// src/use-cases/signin.ts
var SigninUseCase = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  handler(email) {
    return __async(this, null, function* () {
      return this.userRepository.signin(email);
    });
  }
};

// src/use-cases/factory/make-signin-use-case.ts
function makeSigninUseCase() {
  const userRepository = new UserRepository();
  const signinUseCase = new SigninUseCase(userRepository);
  return signinUseCase;
}

// src/http/controller/user/signin.ts
var import_bcryptjs2 = require("bcryptjs");
var import_zod8 = require("zod");
function signin(request, reply) {
  return __async(this, null, function* () {
    const signinBodySchema = import_zod8.z.object({
      email: import_zod8.z.string().email(),
      senha: import_zod8.z.string()
    });
    try {
      const { email, senha } = signinBodySchema.parse(request.body);
      const signinUserUseCase = makeSigninUseCase();
      const user = yield signinUserUseCase.handler(email);
      if (!user) {
        return reply.status(401).send({ message: "Email ou senha incorretos" });
      }
      const doesPasswordMatch = yield (0, import_bcryptjs2.compare)(senha, user.senha);
      if (!doesPasswordMatch) {
        return reply.status(401).send({ message: "Email ou senha incorretos" });
      }
      const findProfessorByNameUseCase = makeFindProfessorByNameUseCase();
      let professorData = null;
      try {
        const professorName = yield findProfessorByNameUseCase.handler(
          user.id || 0
        );
        const professorId = yield findProfessorByNameUseCase.getProfessorId(
          user.id || 0
        );
        professorData = {
          name: professorName,
          id: professorId
        };
      } catch (professorError) {
        console.log("Professor n\xE3o encontrado para este usu\xE1rio");
      }
      const token = yield reply.jwtSign(
        {
          sub: user.id,
          email: user.email,
          professorId: (professorData == null ? void 0 : professorData.id) || null,
          isProfessor: !!professorData
        },
        {
          expiresIn: "7d"
        }
      );
      return reply.status(200).send({
        user: {
          id: user.id,
          email: user.email,
          professorName: professorData == null ? void 0 : professorData.name,
          isProfessor: !!professorData
        },
        token,
        message: "Login realizado com sucesso"
      });
    } catch (error) {
      console.log("=== ERRO NO SIGNIN ===");
      console.log(error);
      if (error instanceof import_zod8.z.ZodError) {
        return reply.status(400).send({
          message: "Dados inv\xE1lidos",
          issues: error.issues
        });
      }
      return reply.status(500).send({
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}
var signinSchema = {
  summary: "User authentication",
  tags: ["Auth"],
  body: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      senha: { type: "string", minLength: 1 }
    },
    required: ["email", "senha"]
  },
  response: {
    200: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            email: { type: "string" },
            professorName: { type: "string", nullable: true },
            isProfessor: { type: "boolean" }
          }
        },
        token: { type: "string" },
        message: { type: "string" }
      }
    },
    401: {
      type: "object",
      properties: {
        message: { type: "string", example: "Email ou senha incorretos" }
      }
    }
  }
};

// src/http/controller/user/routes.ts
function userRoutes(app2) {
  return __async(this, null, function* () {
    app2.post("/user", create2);
    app2.post("/user/signin", { schema: signinSchema }, signin);
  });
}

// src/utils/global-error-handler.ts
var import_process = require("process");
var import_zod9 = require("zod");
var errorHandlerMap = {
  ZodError: (error, _, reply) => {
    return reply.status(400).send(__spreadValues({
      message: "Validation error"
    }, error instanceof import_zod9.ZodError && { error: error.format() }));
  },
  ResourceNotFoundError: (error, __, reply) => {
    return reply.status(404).send({ message: error.message });
  },
  InvalidCredentialsError: (error, __, reply) => {
    return reply.status(401).send({ message: error.message });
  }
};
var globalErrorHandler = (error, _, reply) => {
  if (import_process.env.NODE_ENV === "development") {
    console.error(error);
  }
  const handler = errorHandlerMap[error.constructor.name];
  if (handler) return handler(error, _, reply);
  return reply.status(500).send({ message: "Internal server error" });
};

// src/app.ts
var app = (0, import_fastify.default)({
  logger: true
});
app.register(import_jwt.default, {
  secret: env.JWT_SECRET
});
if (env.ENV !== "production") {
}
app.register(import_swagger.default, {
  openapi: {
    info: {
      title: "Blog dinamico API",
      description: "API for Tech Challenge",
      version: "1.0.0"
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Local server"
      }
    ],
    tags: [
      { name: "Posts", description: "Operations related to posts" },
      { name: "Auth", description: "Authentication operations" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  }
});
app.register(import_swagger_ui.default, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false
  },
  staticCSP: true,
  transformStaticCSP: (header) => header
});
app.register(userRoutes);
app.register(postRoutes);
app.setErrorHandler(globalErrorHandler);
app.get("/", (request, reply) => __async(null, null, function* () {
  return { status: "ok", message: "Servidor rodando!" };
}));
app.ready((err) => {
  if (err) throw err;
  app.swagger();
  console.log(`Swagger docs available at http://localhost:${env.PORT}/docs`);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
