import { Intern } from "./interns";
import { Device } from "./device";
import { Config } from "./config";
import { Cancellable } from "frida";

export class DeviceManager extends Intern {
  private static singleton: null | DeviceManager = null;

  public static getDeviceManager(): DeviceManager {
    if (DeviceManager.singleton) {
      return DeviceManager.singleton;
    }
    DeviceManager.singleton = new DeviceManager();
    return DeviceManager.singleton;
  }

  constructor() {
    super();
  }

  async enumerateDevices(): Promise<Device[]> {
    const data = await Config.fetch(
      `http://localhost:3000/DeviceManager/${this.internId}/enumerateDevices`
    );
    if (data.status === "success") {
      let devicesParams: any[] = await data.data;
      let devices: Device[] = []
      for (let params of devicesParams) {
        // @ts-ignore
        let instance: Device = await Device.new(params)
        devices.push(instance)
      }
      return devices;
    } else {
      throw `DeviceManager.enumerateDevices failed: ${data.reason}`;
    }
  }

  async addRemoteDevice(address: string, options: RemoteDeviceOptions={}) {
    const data = await Config.fetch(
      `http://localhost:3000/DeviceManager/${this.internId}/addRemoteDevice`,
      {address: address, options: options}
    );
    if (data.status === "success") {
      return new Device(data.data);
    } else {
      throw `DeviceManager.addRemoteDevice failed: ${data.reason}`;
    }
  }
}

export interface RemoteDeviceOptions {
  certificate?: string;
  origin?: string;
  token?: string;
  keepaliveInterval?: number;
}

export type DeviceAddedHandler = (device: Device) => void;
export type DeviceRemovedHandler = (device: Device) => void;
export type DevicesChangedHandler = () => void;
