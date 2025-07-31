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

// src/use-cases/find-professor-by-name.ts
var find_professor_by_name_exports = {};
__export(find_professor_by_name_exports, {
  FindProfessorByNameUseCase: () => FindProfessorByNameUseCase
});
module.exports = __toCommonJS(find_professor_by_name_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FindProfessorByNameUseCase
});
