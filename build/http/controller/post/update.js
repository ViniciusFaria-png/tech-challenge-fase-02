"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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

// src/http/controller/post/update.ts
var update_exports = {};
__export(update_exports, {
  update: () => update,
  updatePostSchema: () => updatePostSchema
});
module.exports = __toCommonJS(update_exports);

// src/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
  }
};

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("development"),
  PORT: import_zod.z.coerce.number().default(3e3),
  POSTGRES_DB: import_zod.z.string(),
  POSTGRES_USER: import_zod.z.string(),
  POSTGRES_PASSWORD: import_zod.z.string(),
  POSTGRES_HOST: import_zod.z.string().default("db"),
  POSTGRES_PORT: import_zod.z.coerce.number()
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables");
}
var env = _env.data;

// src/lib/db.ts
var import_pg = require("pg");
var CONFIG = {
  user: env.POSTGRES_USER,
  host: env.POSTGRES_HOST,
  database: env.POSTGRES_DB,
  password: env.POSTGRES_PASSWORD,
  port: env.POSTGRES_PORT
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
var import_zod2 = require("zod");
var updatePostParamsSchema = import_zod2.z.object({
  id: import_zod2.z.string().uuid("Invalid post ID format.")
});
var updatePostBodySchema = import_zod2.z.object({
  titulo: import_zod2.z.string().min(1, "Title cannot be empty.").optional(),
  resumo: import_zod2.z.string().optional(),
  conteudo: import_zod2.z.string().min(1, "Content cannot be empty.").optional(),
  professor_id: import_zod2.z.number().int().positive().optional()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  update,
  updatePostSchema
});
