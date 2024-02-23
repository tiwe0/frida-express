import { DeviceManager } from "../../fe/device_manager";

export async function testDevice(dm: DeviceManager) {
  // @ts-ignore
  let device = await dm.addRemoteDevice("192.168.31.36:12345", undefined);
  let processes = await device.enumerateProcesses()
  for (let process of processes) {
    console.log(process)
  }
  return device
}