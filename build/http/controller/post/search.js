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

// src/http/controller/post/search.ts
var search_exports = {};
__export(search_exports, {
  search: () => search
});
module.exports = __toCommonJS(search_exports);

// src/repositories/post.repository.ts
var PostRepository = class {
  searchQueryString(query) {
    return __async(this, null, function* () {
      return {
        id: "1",
        titulo: "titulo",
        resumo: "resumo",
        conteudo: "conteudo",
        professor_id: 1,
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date()
      };
    });
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
var import_zod = require("zod");
function search(request, reply) {
  return __async(this, null, function* () {
    const registerBodySchema = import_zod.z.object({
      query: import_zod.z.string()
    });
    const { query } = registerBodySchema.parse(request.body);
    try {
      const postRepository = new PostRepository();
      const createSearchUseCase = new SearchQueryStringUseCase(postRepository);
      const post = yield createSearchUseCase.handler(query);
      return reply.status(201).send(post);
    } catch (err) {
      console.log("Not found.");
      return reply.status(404).send();
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  search
});
