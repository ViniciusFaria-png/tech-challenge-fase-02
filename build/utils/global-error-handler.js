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

// src/utils/global-error-handler.ts
var global_error_handler_exports = {};
__export(global_error_handler_exports, {
  errorHandlerMap: () => errorHandlerMap,
  globalErrorHandler: () => globalErrorHandler
});
module.exports = __toCommonJS(global_error_handler_exports);
var import_process = require("process");
var import_zod = require("zod");
var errorHandlerMap = {
  ZodError: (error, _, reply) => {
    return reply.status(400).send(__spreadValues({
      message: "Validation error"
    }, error instanceof import_zod.ZodError && { error: error.format() }));
  },
  ResourceNotFoundError: (error, __, reply) => {
    return reply.status(404).send({ message: error.message });
  },
  InvalidCredentialsError: (error, __, reply) => {
    return reply.status(404).send({ message: error.message });
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  errorHandlerMap,
  globalErrorHandler
});
