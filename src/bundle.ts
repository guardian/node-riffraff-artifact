import archiver = require("archiver");
import { Writable } from "stream";
import { lstat } from "fs";

const fileOrDirectory = (path: string): Promise<"file" | "directory"> =>
  new Promise((resolve, reject) => {
    lstat(path, (err, stats) => {
      if (err) {
        console.error("Could not access", path);
        console.error(err);
        reject(err);
        return;
      }
      if (stats.isDirectory()) {
        resolve("directory");
        return;
      }
      if (stats.isFile()) {
        resolve("file");
        return;
      }
      console.error(`${path} must either be a file or directory`);
      reject();
    });
  });

export const compressToStream = async (
  path: string,
  method: archiver.Format,
  stream: Writable
) => {
  const archive = archiver(method);
  archive.on("warning", err => {
    console.log("Error in attempting to compress", path, err);
  });
  archive.pipe(stream);
  const fileOrDir = await fileOrDirectory(path);
  if (fileOrDir === "directory") {
    archive.directory(path, false);
  }
  if (fileOrDir === "file") {
    const splitPath = path.split("/");
    const name = splitPath[splitPath.length - 1];
    archive.file(path, { name });
  }
  archive.finalize();
};

export const getAllFiles = async (path: string): Promise<string[]> => {
  if(await fileOrDirectory(path) === 'file') return [path]
  
}