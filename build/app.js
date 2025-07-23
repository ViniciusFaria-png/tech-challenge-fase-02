"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_fastify = __toESM(require("fastify"));

// src/lib/db.ts
var import_pg = require("pg");

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("development"),
  PORT: import_zod.z.coerce.number().default(3e3),
  POSTGRES_DB: import_zod.z.string(),
  POSTGRES_USER: import_zod.z.string(),
  POSTGRES_PASSWORD: import_zod.z.string(),
  POSTEGRES_HOST: import_zod.z.string().default("0.0.0.0"),
  POSTGRES_PORT: import_zod.z.coerce.number()
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables");
}
var env = _env.data;

// src/lib/db.ts
var CONFIG = {
  user: env.POSTGRES_USER,
  host: env.POSTEGRES_HOST,
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
      } catch (error) {
        console.error("Error ao conectar ao banco de dados:", error);
        throw error;
      }
    });
  }
  get clientInstance() {
    return this.client;
  }
};
var db = new Database();

// src/repositories/pg/post.repository.ts
var PostRepository = class {
  //async create(): Ana TODO 
  findAll() {
    return __async(this, null, function* () {
      var _a;
      const result = yield (_a = db.clientInstance) == null ? void 0 : _a.query(
        `SELECT id, titulo, resumo, conteudo, professor_id, created_at, updated_at FROM post`
      );
      return (result == null ? void 0 : result.rows) || [];
    });
  }
  //async findById(): Vitor TODO
  //async update(): Ana TODO
  //async delete(): Vitor TODO
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
var import_zod2 = require("zod");
function search(request, reply) {
  return __async(this, null, function* () {
    const registerQuerySchema = import_zod2.z.object({
      query: import_zod2.z.string().min(1, "Query parameter is required")
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
      if (err instanceof import_zod2.z.ZodError) {
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

// src/http/controller/post/routes.ts
function postRoutes(app2) {
  return __async(this, null, function* () {
    app2.get("/posts/search", search);
    app2.get("/posts", findAll);
  });
}

// src/app.ts
var app = (0, import_fastify.default)();
app.register(postRoutes);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
