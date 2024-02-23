import express from "express";

export interface InternObject {
  internId: string;
  ref: any;
}

export class Intern {
  public static interns: { [id: string]: any } = {};
  public static add(item: InternObject) {
    this.interns[item.internId] = item.ref;
  }
  public static get(internId: string): any {
    if (internId in this.interns) {
      return this.interns[internId];
    } else {
      return undefined;
    }
  }
  public static remove(internId: string) {
    delete this.interns[internId];
  }
}

export const router = express.Router();

router.post("/:id/remove", async (req, res) => {
  try {
    let internId = req.params.id;
    Intern.remove(internId);
    res.json({ status: "success", data: internId });
  } catch (e: any) {
    res.json({ status: "error", reason: e.toString() });
  }
});
