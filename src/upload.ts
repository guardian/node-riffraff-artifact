import { Readable, PassThrough } from "stream";
import { Action } from "./environment";
import { Manifest } from "./manifest";
import { compressToStream, getAllFiles, fileOrDirectory } from "./bundle";
import { createReadStream } from "fs";
import { S3 } from "aws-sdk";


const warning = `\u001b[31;1m⚠️ WARNING ⚠️
Uploading the whole project directory will upload node_modules.
This can be very large.
And include your development tools and AWS sdk.
If you are creating a lambda, the AWS sdk is part of the default lambda environment.
It is strongly reccomended to create a bundle and upload that instead.
You may then use your bundler to exclude the aws-sdk.\u001b[0m`;

export const upload = async (
  s3: S3,
  relativePath: string,
  stream: Readable | string,
  manifest: Manifest,
  action?: Action
): Promise<unknown> => {
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

const uploadMany = async (
  s3: S3,
  manifest: Manifest,
  action: Action
): Promise<unknown> => {
  const files = await getAllFiles(action.path);
  const uploads = files.map(file => {
    const stream = createReadStream(`${file}`);
    return upload(s3, file, stream, manifest, action);
  });
  return Promise.all(uploads);
};

const uploadCompressed = async (
  s3: S3,
  manifest: Manifest,
  action: Action
): Promise<void> => {
  console.log(`Attempting to compress ${action.path} to ${action.compress}.`);
  if (!action.compress) {
    throw new Error("Attempted to compress something when compress was false.");
  }
  const stream = new PassThrough();
  await Promise.all([
    compressToStream(action.path, action.compress, stream),
    upload(s3, `${action.action}.${action.compress}`, stream, manifest, action)
  ]);
};

const uploadFiles = async (
  s3: S3,
  manifest: Manifest,
  action: Action
): Promise<unknown> => {
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

export const uploadAction = async (
  s3: S3,
  manifest: Manifest,
  action: Action
): Promise<unknown> => {
  console.log(`Uploading ${action.path}`);
  if (action.path === ".") {
    console.log(warning);
  }
  if (action.compress) {
    return uploadCompressed(s3, manifest, action); // we know this isn't false ;_;
  }
  return uploadFiles(s3, manifest, action);
};
