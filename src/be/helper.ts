import express from "express"
import { Intern } from "./interns";

export interface routerConfig {
  path: string;
  handler: (instance: any, params: any) => Promise<any>;
}

export function registerRouters(
  router: express.Router,
  routerConfigs: routerConfig[]
) {
  for (let routerConfig of routerConfigs) {
    router.post(routerConfig.path, async (req, res) => {
      try {
        console.log(`rec: ${req.originalUrl}`)
        let instance = Intern.get(req.params.id);
        let params = req.body;
        params.instanceId = req.params.id;
        let result = await routerConfig.handler(instance, params);
        res.json({ status: "success", data: result });
      } catch (e: any) {
        console.log(`err: reason: ${e.toString()}`)
        res.json({ status: "error", reason: e.toString() });
      }
    });
  }
}