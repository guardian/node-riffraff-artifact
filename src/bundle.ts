import archiver = require("archiver");
import { Writable } from "stream";
import { lstat, readdir } from "fs";

const fileOrDirectory = (path: string): Promise<"file" | "directory" | false> =>
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
      console.warn(
        `${path} must either be a file or directory`,
        stats.isSymbolicLink()
          ? `(it's a symlink 🔗)`
          : stats.isBlockDevice()
            ? `(it's a block device 💾)`
            : stats.isSocket()
              ? `(it's a socket 🔧)`
              : `(it's unclear what you have here ❓)`
      );
      resolve(false);
    });
  });

export const compressToStream = async (
  path: string,
  method: archiver.Format,
  stream: Writable
) => {
  const archive = archiver(method);
  archive.on("warning", err => {
    console.error("Error in attempting to compress", path, err);
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

const ls = (path: string): Promise<string[]> =>
  new Promise((resolve, reject) => {
    readdir(path, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });

export const getAllFiles = async (path: string): Promise<string[]> => {
  const fileOrDir = await fileOrDirectory(path);
  if (!fileOrDir) {
    return []; // We've hit a symlink or something else that can't be uploaded. Ignore.
  }
  if (fileOrDir === "file") {
    return [path];
  }
  const entries = await ls(path);
  const children = await Promise.all(
    entries.map(name => getAllFiles(`${path}/${name}`))
  );
  return ([] as string[]).concat(...children);
};
