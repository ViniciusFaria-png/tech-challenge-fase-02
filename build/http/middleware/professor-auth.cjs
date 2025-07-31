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

// src/http/middleware/professor-auth.ts
var professor_auth_exports = {};
__export(professor_auth_exports, {
  professorAuth: () => professorAuth
});
module.exports = __toCommonJS(professor_auth_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  professorAuth
});
