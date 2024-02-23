import { testDevice } from "./test_device";
import { testDeviceManager } from "./test_device_manager";
import { testScript } from "./test_script";
import { testSession } from "./test_session";

setImmediate(async () => {
  const dm = await testDeviceManager()
  const device = await testDevice(dm)
  const session = await testSession(device)
  const script = await testScript(session)
  console.log("done.")
  while (1) {
    ;
  }
  process.exit(0)
});

