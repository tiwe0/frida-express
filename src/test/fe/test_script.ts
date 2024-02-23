import { Script } from "../../fe/script";

export async function testScript(script: Script) {
  script.message.connect((data) => {
    console.log("from fe: " + JSON.stringify(data));
  });
  await script.load()
  return script;
}
