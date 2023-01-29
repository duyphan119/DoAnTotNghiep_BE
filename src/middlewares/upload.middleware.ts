import { Request } from "express";
import { mkdirSync } from "fs";
import multer from "multer";
import { extname } from "path";
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ) {
    const path: string = `./`;
    mkdirSync(path, { recursive: true });

    cb(null, path);
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ) {
    const ext = extname(file.originalname);
    cb(null, file.originalname.split(ext)[0] + new Date().getTime() + ext);
  },
});

export const upload = multer({ storage: storage });
