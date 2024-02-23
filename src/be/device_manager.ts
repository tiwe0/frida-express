import express from "express";
import { v4 as uuidv4 } from "uuid";
import { Intern, InternObject } from "./interns";
import { Device, DeviceManager, RemoteDeviceOptions } from "frida";

export const router = express.Router();

router.post("/:id/new", async (req, res) => {
  try {
    let deviceManager: DeviceManager = new DeviceManager();
    Intern.add({
      internId: req.params.id,
      ref: deviceManager,
    });
    res.json({ status: "success", data: req.params.id });
  } catch (e: any) {
    res.json({ status: "error", data: e.toString() });
  }
});

router.post("/:id/dispose", async (req, res) => {
  try {
    Intern.remove(req.params.id);
    res.json({ status: "success", data: req.params.id });
  } catch (e: any) {
    res.json({ status: "error", data: e.toString() });
  }
});

router.post("/:id/enumerateDevices", async (req, res) => {
  try {
    let deviceManager: DeviceManager = Intern.get(req.params.id);
    let result = await deviceManager.enumerateDevices();
    let devicesId = [];
    for (let deviceImpl of result) {
      let deviceIntern = {
        internId: uuidv4(),
        ref: new Device(deviceImpl),
      };
      Intern.add(deviceIntern);
      devicesId.push({
        internId: deviceIntern.internId,
        impl: deviceIntern.ref,
      });
    }
    res.json({ status: "success", data: devicesId });
  } catch (e: any) {
    res.json({ status: "error", reason: e.toString() });
  }
});

router.post("/:id/addRemoteDevice", async (req, res) => {
  try {
    let deviceManager: DeviceManager = Intern.get(req.params.id);
    let { address, options, cancellable } = req.body;
    let device = await deviceManager.addRemoteDevice(
      address,
      options,
      cancellable
    );
    let InternObject: InternObject = {
      internId: uuidv4(),
      ref: device
    }
    Intern.add(InternObject)
    res.json({
      status: "success",
      data: { internId: InternObject.internId, impl: InternObject.ref },
    });
  } catch (e: any) {
    res.json({ status: "error", reason: e.toString() });
  }
});
