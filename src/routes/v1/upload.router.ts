import { Request, Response, Router } from "express";
import * as fs from "fs";
import { promisify } from "util";
import { getCloudinary } from "../../configCloudinary";
import {
  MSG_ERROR,
  MSG_SUCCESS,
  STATUS_CREATED,
  STATUS_INTERVAL_ERROR,
  STATUS_OK,
} from "../../constantList";
import { upload } from "../../middlewares/upload.middleware";
import { generateFolder } from "../../utils";
const uploadRouter = Router();
uploadRouter.post(
  "/single",
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (req.file) {
      const img = await getCloudinary().v2.uploader.upload(req.file.path, {
        folder: "DoAnTotNghiep_BE/" + generateFolder(new Date()),
      });
      const unlinkAsync = promisify(fs.unlink);
      const path = __dirname.split("dist")[0] + req.file.path;
      await unlinkAsync(path);
      return res
        .status(STATUS_CREATED)
        .json({ message: MSG_SUCCESS, data: img });
    } else {
      res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
    }
  }
);

uploadRouter.post(
  "/multiple",
  upload.array("images"),
  async (req: Request, res: Response) => {
    try {
      if (req.files) {
        const result = [];
        const unlinkAsync = promisify(fs.unlink);
        const path = __dirname.split("dist")[0];
        const files = req.files as Express.Multer.File[];
        const promises = [];
        const promiseImgs = [];
        for (let i = 0; i < files.length; i++) {
          const filePath = files[i].path;
          result.push({ path: filePath });
          promiseImgs.push(
            getCloudinary().v2.uploader.upload(filePath, {
              folder: "DoAnTotNghiep_BE/" + generateFolder(new Date()),
            })
          );
        }
        const resultImgs = await Promise.all(promiseImgs);
        for (let i = 0; i < files.length; i++) {
          const filePath = path + files[i].path;
          if (fs.existsSync(filePath)) {
            promises.push(unlinkAsync(filePath));
          }
        }
        await Promise.all(promises);

        return res
          .status(STATUS_CREATED)
          .json({ message: MSG_SUCCESS, data: resultImgs });
      }
    } catch (error) {
      console.log(error);
    }
    return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
  }
);

uploadRouter.post("/delete", async (req: Request, res: Response) => {
  try {
    const { path } = req.body;
    await getCloudinary().v2.uploader.destroy(
      "DoAnTotNghiep_BE" + path.split("DoAnTotNghiep_BE")[1].split(".")[0]
    );
    return res.status(STATUS_OK).json({ message: MSG_SUCCESS });
  } catch (error) {
    console.log(error);
  }
  return res.status(STATUS_INTERVAL_ERROR).json({ message: MSG_ERROR });
});

export default uploadRouter;
