import { Cancellable, ScriptOptions, SnapshotOptions } from "frida";
import { Intern } from "./interns";
import { Config } from "./config";
import { Script } from "./script";
export class Session extends Intern {
  impl: any;
  constructor(params: any = {}) {
    super(params);
    this.impl = params.impl;
  }

  get pid(): number {
    return this.impl.pid;
  }

  get persistTimeout(): number {
    return this.impl.persistTimeout;
  }

  get isDetached(): boolean {
    return this.impl.isDetached;
  }

  async detach(cancellable?: Cancellable): Promise<void> {
    let data = await Config.fetch(
      `http://localhost:3000/Session/${this.internId}/detach`,
      { cancellable: cancellable }
    );
    return;
  }

  async resume(cancellable?: Cancellable): Promise<void> {
    let data = await Config.fetch(
      `http://localhost:3000/Session/${this.internId}/resume`,
      { cancellable: cancellable }
    );
    return;
  }

  async enableChildGating(cancellable?: Cancellable): Promise<void> {
    let data = await Config.fetch(
      `http://localhost:3000/Session/${this.internId}/enableChildGating`,
      { cancellable: cancellable }
    );
    return;
  }

  async disableChildGating(cancellable?: Cancellable): Promise<void> {
    let data = await Config.fetch(
      `http://localhost:3000/Session/${this.internId}/disableChildGating`,
      { cancellable: cancellable }
    );
    return;
  }

  async createScript(
    source: string,
    options: ScriptOptions = {},
    cancellable?: Cancellable
  ): Promise<Script> {
    let data = await Config.fetch(
      `http://localhost:3000/Session/${this.internId}/createScript`,
      {
        source: source,
        options: options,
        cancellable: cancellable,
      }
    );
    if (data.status === "success") {
      let script = new Script(source, data.data);
      return script;
    } else {
      throw `Session.createScript failed: ${data.reason}`;
    }
  }
  async createScriptFromBytes(
    bytes: Buffer,
    options: ScriptOptions = {},
    cancellable?: Cancellable
  ): Promise<Script> {
    let data = await Config.fetch(
      `http://localhost:3000/Session/${this.internId}/createScriptFromBytes`,
      {
        bytes: bytes,
        options: options,
        cancellable: cancellable,
      }
    );
    if (data.status === "success") {
      let script = new Script(data.data);
      return script;
    } else {
      throw `Session.createScriptFromBytes failed: ${data.reason}`;
    }
  }
  async comlileScript(
    source: string,
    options: ScriptOptions = {},
    cancellable?: Cancellable
  ): Promise<Buffer> {
    let data = await Config.fetch(
      `http://localhost:3000/Session/${this.internId}/compileScript`,
      {
        source: source,
        options: options,
        cancellable: cancellable,
      }
    );
    if (data.status === "success") {
      return data.data;
    } else {
      throw `Session.compileScript failed: ${data.reason}`;
    }
  }
  async snapshotScript(
    embedScript: string,
    options: SnapshotOptions = {},
    cancellable?: Cancellable
  ): Promise<void> {
    let data = await Config.fetch(
      `http://localhost:3000/Session/${this.internId}/snapshotScript`,
      {
        embedScript: embedScript,
        options: options,
        cancellable: cancellable,
      }
    );
    if (data.status === "success") {
        return
    } else {
      throw `Session.snapshotScript failed: ${data.reason}`;
    }
  }
}
