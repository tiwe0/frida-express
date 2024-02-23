import express from "express";
import { Intern, InternObject } from "./interns";
import { Session } from "frida";
import { v4 as uuidv4 } from "uuid";
import { registerRouters, routerConfig } from "./helper";
import { ScriptProxy } from "./script";

export const router = express.Router();

var sessionRouterConfigs: routerConfig[] = [
  {
    path: "/:id/detach",
    async handler(instance: Session, parameters) {
      await instance.detach(parameters.cancellable);
    },
  },
  {
    path: "/:id/resume",
    async handler(instance: Session, parameters) {
      await instance.resume(parameters.cancellable);
    },
  },
  {
    path: "/:id/enableChildGating",
    async handler(instance: Session, parameters) {
      await instance.enableChildGating(parameters.cancellable);
    },
  },
  {
    path: "/:id/disableChildGating",
    async handler(instance: Session, parameters) {
      await instance.disableChildGating(parameters.cancellable);
    },
  },
  {
    // 类似tcp第一次请求，返回端口进行ACK
    // BUG: 这里注册的Object的ref是scriptProxy
    path: "/:id/createScript",
    async handler(instance: Session, parameters) {
      let script = await instance.createScript(
        parameters.source,
        parameters.options,
        parameters.cancellable
      );
      // 这里初始化 ScriptProxy 的时候，自动建立了一个wss监听，并将监听的端口，internId，返回，等价于ACK操作
      let scriptProxy = await ScriptProxy.new(script)
      let InternObject: InternObject = {
        internId: uuidv4(),
        ref: scriptProxy,
      };
      Intern.add(InternObject);
      // 返回后，前端ACK后建立一个 ws 连接
      return { internId: InternObject.internId, port: scriptProxy.port };
    },
  },
  {
    path: "/:id/createScriptFromBytes",
    async handler(instance: Session, parameters) {
      let script = await instance.createScriptFromBytes(
        parameters.bytes,
        parameters.options,
        parameters.cancellable
      );
      let scriptProxy = await ScriptProxy.new(script)
      let InternObject: InternObject = {
        internId: uuidv4(),
        ref: scriptProxy,
      };
      Intern.add(InternObject);
      return { internId: InternObject.internId, port: scriptProxy.port };
    },
  },
  {
    path: "/:id/compileScript",
    async handler(instance: Session, parameters) {
      let script = await instance.compileScript(
        parameters.source,
        parameters.options,
        parameters.cancellable
      );
      let InternObject: InternObject = {
        internId: uuidv4(),
        ref: script,
      };
      Intern.add(InternObject);
      return { internId: InternObject.internId, impl: InternObject.ref };
    },
  },
  {
    path: "/:id/snapshotScript",
    async handler(instance: Session, parameters) {
      await instance.snapshotScript(
        parameters.embedScript,
        parameters.options,
        parameters.cancellable
      );
    },
  },
];

registerRouters(router, sessionRouterConfigs);
