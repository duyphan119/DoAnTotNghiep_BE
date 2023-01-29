import { Request, Response, Router } from "express";
import * as fs from "fs";
import { promisify } from "util";
import { getCloudinary } from "../../configCloudinary";
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
      const path = __dirname.split("dist")[0];

      console.log({ __dirname, path, filePath: req.file.path });
      console.log(path, req.file.path);
      console.log("XÓA::::::::", path + "/" + req.file.path);
      await unlinkAsync(path + "/" + req.file.path);
      return res.status(201).json({ message: "Success", data: img });
    } else {
      res.status(500).json({ message: `Error` });
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
        console.log(files, path);
        for (let i = 0; i < files.length; i++) {
          const filePath = files[i].path;
          result.push({ path: filePath });
          promiseImgs.push(
            getCloudinary().v2.uploader.upload(filePath, {
              folder: "DoAnTotNghiep_BE/" + generateFolder(new Date()),
            })
          );
          console.log("XÓA::::::::", path + "/" + filePath);

          promises.push(unlinkAsync(path + "/" + filePath));
        }
        const resultImgs = await Promise.all(promiseImgs);
        await Promise.all(promises);

        return res.status(201).json({ message: "Success", data: resultImgs });
      }
    } catch (error) {
      console.log(error);
    }
    return res.status(500).json({ message: `Error` });
  }
);

export default uploadRouter;
