import { Device } from "../../fe/device";
import { readFileSync } from "fs";
import path from "path";

export async function testSession(device: Device) {
  // @ts-ignore
  let currentPath = __dirname;
  let session = await device.attach("天气");
  console.log(`reading from ${currentPath}`)
  let source = readFileSync(path.join(currentPath, "test_script_ext.js"), "utf8");
  console.log(source)
  let script = await session.createScript(source, {});
  return script;
}
