import { DeviceManager } from "../../fe/device_manager";

export async function testDeviceManager() {
  // @ts-ignore
  let dm: DeviceManager = await DeviceManager.new();

  // test enumerateDevices
  let devices = await dm.enumerateDevices();
  console.log(devices);

  // test addDevices
  let device = await dm.addRemoteDevice("192.168.31.55:12345", undefined);
  console.log(device);
  return dm
}
