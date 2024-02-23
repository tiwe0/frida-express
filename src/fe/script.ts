import { Cancellable, EnableDebuggerOptions } from "frida";
import { Intern } from "./interns";
import { RawData, WebSocket } from "ws";
import { Config } from "./config";

export class RPCProxy extends Intern {
  constructor(params: any = {}) {
    super(params);
  }
}

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
  rpc: RPCProxy;

  constructor(params: any = {}) {
    super(params);
    this.impl = params.impl;
    this.message = new IOProxy(params);
    this.rpc = new RPCProxy(params);
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
