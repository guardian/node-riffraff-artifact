import { Readable, PassThrough } from "stream";
import { Action } from "./environment";
import { Manifest, uploadManifest } from "./manifest";
import { compressToStream, getAllFiles, fileOrDirectory } from "./bundle";
import { createReadStream } from "fs";
import { S3 } from "aws-sdk";

export const upload = async (
  s3: S3,
  relativePath: string,
  stream: Readable | string,
  manifest: Manifest,
  action?: Action
) => {
  const name = relativePath.replace(/^\.\//, ""); // Strip any errant ./'s
  const path = [
    manifest.projectName,
    manifest.buildNumber,
    action && action.action,
    name
  ]
    .filter(_ => _ != null)
    .join("/");
  const result = await s3
    .upload({
      ACL: "bucket-owner-read",
      Body: stream,
      Bucket: "riffraff-artifact",
      Key: path
    })
    .promise();
  console.log("Uploaded artifact ", path);
  return result;
};

export const uploadAction = async (
  s3: S3,
  manifest: Manifest,
  action: Action
) => {
  if (action.compress) {
    return uploadCompressed(s3, manifest, action); // we know this isn't false ;_;
  }
  return uploadFiles(s3, manifest, action);
};

const uploadFiles = async (s3: S3, manifest: Manifest, action: Action) => {
  const isFileOrDir = await fileOrDirectory(action.path);
  if (isFileOrDir === "directory") {
    return uploadMany(s3, manifest, action);
  }

  if (isFileOrDir === "file") {
    const stream = createReadStream(`${action.path}`);
    const name = action.path.split("/").pop();
    if (name) {
      return upload(s3, name, stream, manifest, action);
    }
  }
  throw new Error("Could not find anything to upload.");
};

const uploadMany = async (s3: S3, manifest: Manifest, action: Action) => {
  const files = await getAllFiles(action.path);
  const uploads = files.map(file => {
    const stream = createReadStream(`${file}`);
    return upload(s3, file, stream, manifest, action);
  });
  return Promise.all(uploads);
};

const uploadCompressed = async (s3: S3, manifest: Manifest, action: Action) => {
  if (!action.compress) {
    throw new Error("Attempted to compress something when compress was false.");
  }
  const stream = new PassThrough();

  return Promise.all([
    compressToStream(action.path, action.compress, stream),
    upload(s3, `${action.action}.${action.compress}`, stream, manifest, action)
  ]);
};
