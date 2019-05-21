import { S3 } from "aws-sdk";
import { Readable, PassThrough } from "stream";
import { Action } from "./environment";
import { Manifest, uploadManifest } from "./manifest";
import { compressToStream, getAllFiles } from "./bundle";
import { createReadStream } from "fs";

const s3 = new S3({
  region: "eu-west-1"
});

export const uploadStream = (
  relativePath: string,
  stream: Readable,
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
  return s3
    .upload({
      ACL: "bucket-owner-read",
      Body: stream,
      Bucket: "riffraff-artifact",
      Key: path
    })
    .promise();
};

export const uploadAction = (manifest: Manifest, action: Action) => {
  if (action.compress) {
    return uploadCompressed(manifest, action); // we know this isn't false ;_;
  }
  return uploadMany(manifest, action);
};

const uploadMany = async (manifest: Manifest, action: Action) => {
  const files = await getAllFiles(action.path);
  const uploads = files.map(file => {
    const stream = createReadStream(`${file}`);
    return uploadStream(file, stream, manifest, action);
  });
  return Promise.all(uploads);
};

const uploadCompressed = (manifest: Manifest, action: Action) => {
  if (!action.compress) {
    throw new Error("Attempted to compress something when compress was false.");
  }
  const stream = new PassThrough();
  compressToStream(action.path, action.compress, stream).catch(_ =>
    console.log(_)
  );

  return Promise.all([
    uploadStream(`${action.action}.${action.compress}`, stream, manifest)
  ]);
};
