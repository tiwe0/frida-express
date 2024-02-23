import express from "express";
import { Intern, InternObject } from "./interns";
import { Device } from "frida";
import { v4 as uuidv4 } from "uuid";
import { registerRouters, routerConfig } from "./helper";

export const router = express.Router();

var deviceRouterConfigs: routerConfig[] = [
  {
    path: "/:id/new",
    async handler(instance, parameters) {
        let device: Device = new Device(parameters.impl)
        Intern.add({
            internId: parameters.instanceId,
            ref: device
        })
      return parameters.instanceId;
    },
  },
  {
    path: "/:id/querySystemParameters",
    async handler(instance: Device, parameters) {
      return await instance.querySystemParameters();
    },
  },
  {
    path: "/:id/getFrontmostApplication",
    async handler(instance: Device, parameters) {
      return await instance.getFrontmostApplication(
        parameters.options,
        parameters.cancellable
      );
    },
  },
  {
    path: "/:id/enumerateApplications",
    async handler(instance: Device, parameters) {
      return await instance.enumerateApplications(
        parameters.options,
        parameters.cancellable
      );
    },
  },
  {
    path: "/:id/enumerateProcesses",
    async handler(instance: Device, parameters) {
      return await instance.enumerateProcesses(
        parameters.options,
        parameters.cancellable
      );
    },
  },
  {
    path: "/:id/getProcess",
    async handler(instance: Device, parameters) {
      return await instance.getProcess(
        parameters.name,
        parameters.options,
        parameters.cancellable
      );
    },
  },
  {
    path: "/:id/enableSpawnGating",
    async handler(instance: Device, parameters) {
      return await instance.enableSpawnGating(parameters.cancellable);
    },
  },
  {
    path: "/:id/disableSpawnGating",
    async handler(instance: Device, parameters) {
      return await instance.disableSpawnGating(parameters.cancellable);
    },
  },
  {
    path: "/:id/enumeratePendingSpawn",
    async handler(instance: Device, parameters) {
      return await instance.enumeratePendingSpawn();
    },
  },
  {
    path: "/:id/enumeratePendingChildren",
    async handler(instance: Device, parameters) {
      return await instance.enumeratePendingChildren();
    },
  },
  {
    path: "/:id/spawn",
    async handler(instance: Device, parameters) {
      return await instance.spawn(
        parameters.program,
        parameters.options,
        parameters.cancellable
      );
    },
  },
  {
    path: "/:id/input",
    async handler(instance: Device, parameters) {
      return await instance.input(
        parameters.target,
        parameters.data,
        parameters.cancellable
      );
    },
  },
  {
    path: "/:id/resume",
    async handler(instance: Device, parameters) {
      return await instance.resume(parameters.target, parameters.cancellable);
    },
  },
  {
    path: "/:id/kill",
    async handler(instance: Device, parameters) {
      return await instance.kill(parameters.target, parameters.cancellable);
    },
  },
  {
    path: "/:id/attach",
    async handler(instance: Device, parameters) {
      let session = await instance.attach(
        parameters.target,
        parameters.options,
        parameters.cancellable
      )
      let InternObject: InternObject = {
        internId: uuidv4(),
        ref: session
      }
      Intern.add(InternObject)
      return {
        internId: InternObject.internId,
        ref: InternObject.ref
      }
    },
  },
  {
    path: "/:id/injectLibraryFile",
    async handler(instance: Device, parameters) {
      return await instance.injectLibraryFile(
        parameters.target,
        parameters.path,
        parameters.entrypoint,
        parameters.data,
        parameters.cancellable
      );
    },
  },
  {
    path: "/:id/injectLibraryBlob",
    async handler(instance: Device, parameters) {
      return await instance.injectLibraryBlob(
        parameters.target,
        parameters.blob,
        parameters.entrypoint,
        parameters.data,
        parameters.cancellable
      );
    },
  },
  {
    // TODO
    path: "/:id/openChannel",
    async handler(instance: Device, parameters) {},
  },
  {
    path: "/:id/unpair",
    async handler(instance: Device, parameters) {
      return await instance.unpair(parameters.cancellable);
    },
  },
];

registerRouters(router, deviceRouterConfigs);
