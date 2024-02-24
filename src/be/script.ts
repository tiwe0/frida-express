import express from "express";
import { Intern, InternObject } from "./interns";
import { Message, Script, ScriptMessageHandler, Session } from "frida";
import { v4 as uuidv4 } from "uuid";
import { registerRouters, routerConfig } from "./helper";
import { Server } from "ws";

export const router = express.Router();

/**
 * 该对象用来代理Script对象
 * 初始化后，会将传入的script对象的message信号连接到socket上，传输给前端
 */
export class ScriptProxy {
  script: Script;
  wss: Server | undefined;
  port: number | undefined;
  constructor(script: Script) {
    this.script = script;
  }
  public static adaptorHandler(message: Message, data: Buffer | null) {
    return JSON.stringify({message: message, data: data})
  }
  public static async new(script: Script) {
    const scriptProxy = new ScriptProxy(script);
    // @ts-ignore
    const getPort = (await import("get-port")).default
    const port = await getPort();
    scriptProxy.port = port;
    scriptProxy.wss = new Server({ port: port });
    scriptProxy.wss.on("connection", (ws) => {
      console.log(`connected.`);
      scriptProxy.script.message.connect((message, data) => {
        let adaptedMessage: string = this.adaptorHandler(message, data)
        ws.send(adaptedMessage);
      });
    });
    return scriptProxy;
  }
}

var scriptRouterConfigs: routerConfig[] = [
  {
    path: "/:id/load",
    async handler(instance: ScriptProxy, params) {
      return await instance.script.load(params.cancellable);
    },
  },
  {
    path: "/:id/unload",
    async handler(instance: ScriptProxy, params) {
      return await instance.script.unload(params.cancellable);
    },
  },
  {
    path: "/:id/eternalize",
    async handler(instance: ScriptProxy, params) {
      return await instance.script.eternalize(params.cancellable);
    },
  },
  {
    path: "/:id/post",
    async handler(instance: ScriptProxy, params) {
      return instance.script.post(params.message, params.data);
    },
  },
  {
    path: "/:id/enableDebugger",
    async handler(instance: ScriptProxy, params) {
      return await instance.script.enableDebugger(params.options, params.cancellable);
    },
  },
  {
    path: "/:id/disableDebugger",
    async handler(instance: ScriptProxy, params) {
      return await instance.script.disableDebugger(params.cancellable);
    },
  },
  {
    path: "/:id/connect/message",
    async handler(instance: ScriptProxy, params) {
      let func: ScriptMessageHandler = eval(params.messageFuncString);
      instance.script.message.connect(func);
      return "connected";
    },
  },
  {
    path: "/:id/rpc/m/:methodName",
    async handler(instance: ScriptProxy, params) {
      let methodName = params.params.methodName
      let argumentsList = params.args
      let result = await instance.script.exports[methodName](...argumentsList)
      return result
    }
  },
  {
    path: "/:id/rpc/p/:propertyName",
    async handler(instance: ScriptProxy, params) {
      let propertyName = params.params.propertyName
      let value = instance.script.exports[propertyName]
      return value
    }
  }
];

registerRouters(router, scriptRouterConfigs);
