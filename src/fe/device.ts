import {
  Application,
  Cancellable,
  Child,
  IOStream,
  ProcessID,
  ProcessName,
  Spawn,
  SystemParameters,
} from "frida";
import { Icon } from "./icon";
import { Intern } from "./interns";
import { Config } from "./config";
import { Process } from "./process";
import { Session } from "./session";
export class Device extends Intern {
  private device: any;
  constructor(params: any) {
    super();
    this.device = params.impl;
    if (params.internId) {
      this.changeInternId(params.internId)
    }
  }

  public static async new(params: any) {
    const d = new Device(params)
    return d
  }

  get id(): string {
    return this.device.impl.id;
  }

  get name(): string {
    return this.device.impl.name;
  }

  get icon(): Icon {
    return this.device.impl.icon;
  }

  get type(): DeviceType {
    return this.device.impl.type;
  }
  get isLost(): boolean {
    return this.device.impl.isLost;
  }
  async querySystemParameters(
    cancellable?: Cancellable
  ): Promise<SystemParameters> {
    let data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/querySystemParameters`,
      { cancellable: cancellable }
    );
    if (data.status === "success") {
      let d: SystemParameters = data.data;
      return d;
    } else {
      throw `Device[${this.internId}].querySystemParameters failed`;
    }
  }
  async getFrontmostApplication(
    options: FrontmostQueryOptions = {},
    cancellable?: Cancellable
  ): Promise<Application | null> {
    let data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/getFrontmostApplication`,
      { options: options, cancellable: cancellable }
    );
    if (data.status === "success") {
      let d: Application = data.data;
      return d;
    } else {
      throw `Device[${this.internId}].getFrontmostApplication failed`;
    }
  }
  async enumerateApplications(
    options: ApplicationQueryOptions = {},
    cancellable?: Cancellable
  ): Promise<Application[]> {
    let data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/enumerateApplications`,
      { options: options, cancellable: cancellable }
    );
    if (data.status === "success") {
      let d: Application[] = data.data;
      return d;
    } else {
      throw `Device[${this.internId}].enumerateApplications failed`;
    }
  }
  async enumerateProcesses(
    options: ProcessQueryOptions = {},
    cancellable?: Cancellable
  ): Promise<Process[]> {
    let data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/enumerateProcesses`,
      { options: options, cancellable: cancellable }
    );
    if (data.status === "success") {
      let d: Process[] = data.data;
      return d;
    } else {
      throw `Device[${this.internId}].enumerateApplications failed`;
    }
  }
  async getProcess(
    name: string,
    options: ProcessMatchOptions = {},
    cancellable?: Cancellable
  ): Promise<Process> {
    let data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/getProcess`,
      { name: name, options: options, cancellable: cancellable }
    );
    if (data.status === "success") {
      let d: Process = data.data;
      return d;
    } else {
      throw `Device[${this.internId}].getProcess failed`;
    }
  }
  async enableSpawnGating(cancellable?: Cancellable): Promise<void> {
    let data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/enableSpawnGating`,
      { cancellable: cancellable }
    );
    if (data.status === "success") {
      return;
    } else {
      throw `Device[${this.internId}].enableSpawnGating failed`;
    }
  }
  async disableSpawnGating(cancellable?: Cancellable): Promise<void> {
    let data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/disableSpawnGating`,
      { cancellable: cancellable }
    );
    if (data.status === "success") {
      return;
    } else {
      throw `Device[${this.internId}].disableSpawnGating failed`;
    }
  }
  async enumeratePendingSpawn(cancellable?: Cancellable): Promise<Spawn[]> {
    let data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/enumeratePendingSpawn`,
      { cancellable: cancellable }
    );
    if (data.status === "success") {
      let d: Spawn[] = data.data;
      return d;
    } else {
      throw `Device[${this.internId}].enumeratePendingSpawn failed`;
    }
  }
  async enumeratePendingChildren(cancellable?: Cancellable): Promise<Child[]> {
    let data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/enumeratePendingChildren`,
      { cancellable: cancellable }
    );
    if (data.status === "success") {
      let d: Child[] = data.data;
      return d;
    } else {
      throw `Device[${this.internId}].enumeratePendingChildren failed`;
    }
  }
  async spawn(
    program: string | string[],
    options: SpawnOptions = {},
    cancellable?: Cancellable
  ): Promise<ProcessID> {
    let data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/spawn`,
      { program: program, options: options, cancellable: cancellable }
    );
    if (data.status === "success") {
      let d: ProcessID = data.data;
      return d;
    } else {
      throw `Device[${this.internId}].spawn failed`;
    }
  }
  async input(
    target: TargetProcess,
    data: Buffer,
    cancellable?: Cancellable
  ): Promise<void> {
    let _data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/input`,
      { target: target, data: data, cancellable: cancellable }
    );
    if (_data.status === "success") {
      return;
    } else {
      throw `Device[${this.internId}].input failed`;
    }
  }
  async resume(
    target: TargetProcess,
    cancellable?: Cancellable
  ): Promise<void> {
    let _data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/resume`,
      { target: target, cancellable: cancellable }
    );
    if (_data.status === "success") {
      return;
    } else {
      throw `Device[${this.internId}].resume failed`;
    }
  }
  async kill(target: TargetProcess, cancellable?: Cancellable): Promise<void> {
    let _data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/resume`,
      { target: target, cancellable: cancellable }
    );
    if (_data.status === "success") {
      return;
    } else {
      throw `Device[${this.internId}].kill failed`;
    }
  }
  async attach(
    target: TargetProcess,
    options: SessionOptions = {},
    cancellable?: Cancellable
  ): Promise<Session> {
    let _data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/attach`,
      { target: target, options: options, cancellable: cancellable }
    );
    if (_data.status === "success") {
      let session = new Session({impl: _data.data.impl, internId: _data.data.internId})
      return session;
    } else {
      throw `Device[${this.internId}].attach failed`;
    }
  }
  async injectLibraryFile(
    target: TargetProcess,
    path: string,
    entrypoint: string,
    data: string,
    cancellable?: Cancellable
  ): Promise<void> {
    let _data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/injectLibraryFile`,
      {
        target: target,
        path: path,
        entrypoint: entrypoint,
        data: data,
        cancellable: cancellable,
      }
    );
    if (_data.status === "success") {
      return;
    } else {
      throw `Device[${this.internId}].injectLibraryFile failed`;
    }
  }
  async injectLibraryBlob(
    target: TargetProcess,
    blob: Buffer,
    entrypoint: string,
    data: string,
    cancellable?: Cancellable
  ): Promise<void> {
    let _data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/injectLibraryBlob`,
      {
        target: target,
        blob: blob,
        entrypoint: entrypoint,
        data: data,
        cancellable: cancellable,
      }
    );
    if (_data.status === "success") {
      return;
    } else {
      throw `Device[${this.internId}].injectLibraryBlob failed`;
    }
  }
  async openChannel(
    address: string,
    cancellable?: Cancellable
  ): Promise<IOStream> {
    let _data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/openChannel`,
      { address: address, cancellable: cancellable }
    );
    if (_data.status === "success") {
      let d: IOStream = _data.data;
      return d;
    } else {
      throw `Device[${this.internId}].openChannel failed`;
    }
  }
  async unpair(cancellable?: Cancellable): Promise<void> {
    let _data = await Config.fetch(
      `http://localhost:3000/Device/${this.internId}/unpair`,
      { cancellable: cancellable }
    );
    if (_data.status === "success") {
      return;
    } else {
      throw `Device[${this.internId}].unpair failed`;
    }
  }
}

export enum DeviceType {
  Local = "local",
  Remote = "remote",
  Usb = "usb",
}

export interface FrontmostQueryOptions {
  /**
   * How much data to collect about the frontmost application. The default is `Scope.Minimal`,
   * which means no parameters will be collected. Specify `Scope.Metadata` to collect all
   * parameters except icons, which can be included by specifying `Scope.Full`.
   */
  scope?: Scope;
}

export interface ApplicationQueryOptions {
  /**
   * Limit enumeration to one or more application IDs only. Typically used to fetch additional
   * details about a subset, e.g. based on user interaction.
   */
  identifiers?: string[];

  /**
   * How much data to collect about each application. The default is `Scope.Minimal`, which
   * means no parameters will be collected. Specify `Scope.Metadata` to collect all parameters
   * except icons, which can be included by specifying `Scope.Full`.
   */
  scope?: Scope;
}

export interface ProcessQueryOptions {
  /**
   * Limit enumeration to one or more process IDs only. Typically used to fetch additional
   * details about a subset, e.g. based on user interaction.
   */
  pids?: number[];

  /**
   * How much data to collect about each process. The default is `Scope.Minimal`, which
   * means no parameters will be collected. Specify `Scope.Metadata` to collect all
   * parameters except icons, which can be included by specifying `Scope.Full`.
   */
  scope?: Scope;
}

export interface ProcessMatchOptions {
  /**
   * How much data to collect about the matching process. The default is `Scope.Minimal`,
   * which means no parameters will be collected. Specify `Scope.Metadata` to collect all
   * parameters except icons, which can be included by specifying `Scope.Full`.
   */
  scope?: Scope;
}

/**
 * How much data to collect about a given application or process.
 */
export enum Scope {
  /**
   * Don't collect any parameters. This is the default.
   */
  Minimal = "minimal",

  /**
   * Collect all parameters except icons.
   */
  Metadata = "metadata",

  /**
   * Collect all parameters, including icons.
   */
  Full = "full",
}

export interface SpawnOptions {
  argv?: string[];
  envp?: { [name: string]: string };
  env?: { [name: string]: string };
  cwd?: string;
  stdio?: Stdio;

  [name: string]: any;
}

export enum Stdio {
  Inherit = "inherit",
  Pipe = "pipe",
}

export type TargetProcess = ProcessID | ProcessName;

export interface SessionOptions {
  realm?: Realm;
  persistTimeout?: number;
}

export enum Realm {
  Native = "native",
  Emulated = "emulated",
}
