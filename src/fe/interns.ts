import { v4 as uuidv4 } from "uuid";
import { Config } from "./config";
export class Intern {
  public static intersManager: { [id: string]: WeakRef<Intern> } = {};
  public static monitorOn: boolean = false;
  public static monitorIntervalId: NodeJS.Timeout;
  public internId: string;
  constructor(params: any = {}) {
    if (params && params.internId) {
      this.internId = params.internId
    } else {
      this.internId = uuidv4();
    }
    Intern.intersManager[this.internId] = new WeakRef(this);
    if (!Intern.monitorOn) {
      Intern.monitor();
    }
  }
  public static monitor() {
    this.monitorOn = true;
    this.monitorIntervalId = setInterval(async () => {
      if (Object.keys(this.intersManager).length === 0) {
        clearInterval(this.monitorIntervalId);
        this.monitorOn = false;
        return;
      }
      for (let internId in this.intersManager) {
        let instance = this.intersManager[internId];
        if (instance === undefined) {
          delete this.intersManager[internId];
          setImmediate(async () => {
            let data = await Config.fetch(
              `http://localhost:3000/Intern/${internId}/remove`
            );
            if (data.status === "success") {
              console.log(`remove remote instance: ${internId} successfully`);
            } else {
              console.error(
                `remove remote instance: ${internId} failed: ${data.reason}`
              );
            }
          });
        }
      }
    }, 4000);
  }
  public static async new(params: object = {}) {
    let clazzName = this.name;
    let instance = new this(params);
    let data = await Config.fetch(
      `http://localhost:3000/${clazzName}/${instance.internId}/new`,
      params
    );
    if (data.status === "success") {
      return instance;
    } else {
      Intern.remove(instance.internId);
      console.log(`${clazzName}.new failed: ${data.reason}`);
    }
  }
  public static get(id: string) {
    if (id in this.intersManager) {
      let instance = this.intersManager[id].deref();
      if (instance === undefined) {
        delete this.intersManager[id];
      }
      return instance;
    }
    return undefined;
  }
  public static add(instance: Intern) {
    this.intersManager[instance.internId] = new WeakRef(instance);
  }
  public static remove(id: string) {
    if (id in this.intersManager) {
      delete this.intersManager[id];
    }
  }
  public changeInternId(internId: string) {
    Intern.intersManager[internId] = new WeakRef(this);
    Intern.remove(this.internId);
    this.internId = internId;
  }
}
