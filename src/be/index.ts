import { router as RouterDeviceManager } from "./device_manager";
import { router as RouterDevice } from "./device";
import { router as RouterIntern } from "./interns";
import { router as RouterSession } from "./session";
import { router as RouterScript } from "./script";
import { Intern } from "./interns";
import express from "express";
import cors from "cors";

console.log(Intern)
const app = express()
var port = 3000
var host = "localhost"

app.use(cors())
app.use(express.json())
app.use("/Intern", RouterIntern)
app.use("/DeviceManager", RouterDeviceManager)
app.use("/Device", RouterDevice)
app.use("/Session", RouterSession)
app.use("/Script", RouterScript)

app.listen(port,()=> {
    console.log(`fridbg-be listen on http://${host}:${port}`)
})


