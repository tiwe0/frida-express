import { Cancellable, EnableDebuggerOptions } from "frida";
import { Intern } from "./interns";
import { RawData, WebSocket } from "ws";
import { getRPCExportsFunctions } from "./helper";
import { Config } from "./config";

export class IOProxy extends Intern {
  public ws: WebSocket;

  public defaultHandler(socketId: string, message: { toString: () => any }) {
    console.log(`socket[${socketId}]: ${message}`);
  }

  constructor(params: any = {}) {
    super(params);
    this.ws = new WebSocket(`ws://localhost:${params.port}`);
    this.initWS();
  }

  public connect(
    handler: (data: string) => void
  ) {
    if (this.ws) {
      this.ws.on("message", (message) => {
        let msg = JSON.parse(message.toString())
        handler(msg);
      });
    }
  }

  public initWS() {
    this.ws!.on("open", () => {
      console.debug("socket opened!");
    });
    this.ws!.on("message", (message) => {
      this.defaultHandler(this.internId, message);
    });
    this.ws!.on("error", (error) => {
      console.error(error.message);
    });
    this.ws!.on("close", () => {
      console.debug("socket closed!");
    });
  }
}

export class Script extends Intern {
  impl: any;
  message: IOProxy;
  rpc: any;

  constructor(source: string, params: any = {}) {
    super(params);
    this.impl = params.impl;
    this.message = new IOProxy(params);
    this.rpc = Script.genRPCProxy(this, source);
  }

  public static genRPCProxy(instance: Script, source: string) {
    let rpcExportFunctions: string[] = getRPCExportsFunctions(source);
    let proxy: { [key: string]: any } = {};
    for (let rpcExportFunctionName of rpcExportFunctions) {
      proxy[rpcExportFunctionName] = async (...args: any[]) => {
        let rpcUrl = `http://localhost:3000/Script/${instance.internId}/rpc/m/${rpcExportFunctionName}`;
        let result = await Config.fetch(rpcUrl, {args: args});
        if (result.status === "success") {
          return result.data;
        } else {
          throw `RPC call failed: ${result.reason}`;
        }
      };
      console.log(`rpc.exports.${rpcExportFunctionName} added.`)
    }
    return proxy;
  }

  async load(cancellable?: Cancellable) {
    let result = await Config.fetch(
      `http://localhost:3000/Script/${this.internId}/load`,
      { cancellable: cancellable }
    );
  }

  async unload(cancellable?: Cancellable) {
    let result = await Config.fetch(
      `http://localhost:3000/Script/${this.internId}/unload`,
      { cancellable: cancellable }
    );
  }

  async eternalize(cancellable?: Cancellable) {
    let result = await Config.fetch(
      `http://localhost:3000/Script/${this.internId}/eternalize`,
      { cancellable: cancellable }
    );
  }

  async post(message: any, data: Buffer | null = null) {
    let result = await Config.fetch(
      `http://localhost:3000/Script/${this.internId}/post`,
      { message: message, data: data }
    );
  }

  async enableDebugger(
    options: EnableDebuggerOptions = {},
    cancellable?: Cancellable
  ) {
    let result = await Config.fetch(
      `http://localhost:3000/Script/${this.internId}/enableDebugger`,
      { options: options, cancellable: cancellable }
    );
  }

  async disableDebugger(cancellable?: Cancellable) {
    let result = await Config.fetch(
      `http://localhost:3000/Script/${this.internId}/enableDebugger`,
      { cancellable: cancellable }
    );
  }
}
