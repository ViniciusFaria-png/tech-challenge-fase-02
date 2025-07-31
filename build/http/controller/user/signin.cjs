"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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

// src/http/controller/user/signin.ts
var signin_exports = {};
__export(signin_exports, {
  signin: () => signin,
  signinSchema: () => signinSchema
});
module.exports = __toCommonJS(signin_exports);

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
var import_bcryptjs = require("bcryptjs");
var import_zod2 = require("zod");
function signin(request, reply) {
  return __async(this, null, function* () {
    const signinBodySchema = import_zod2.z.object({
      email: import_zod2.z.string().email(),
      senha: import_zod2.z.string()
    });
    try {
      const { email, senha } = signinBodySchema.parse(request.body);
      const signinUserUseCase = makeSigninUseCase();
      const user = yield signinUserUseCase.handler(email);
      if (!user) {
        return reply.status(401).send({ message: "Email ou senha incorretos" });
      }
      const doesPasswordMatch = yield (0, import_bcryptjs.compare)(senha, user.senha);
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
      if (error instanceof import_zod2.z.ZodError) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  signin,
  signinSchema
});
