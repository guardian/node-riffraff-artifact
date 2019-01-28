import { S3 } from "aws-sdk";
import { Readable, Writable, Duplex } from "stream";
import {  Action } from './config';
import { Manifest } from './manifest';
import { compressToStream } from './bundle';
import { createReadStream } from "fs";
import { Format } from "archiver";
const s3 = new S3({
  region: "eu-west-1"
});

export const uploadStream = (
  name: string,
  stream: Readable,
  manifest: Manifest,
  action?: Action
) => {
  const path = [manifest.projectName, manifest.buildNumber, action && action.action , name]
    .filter(_ => _ != null)
    .join("/");
  return s3.upload({
    ACL: "bucket-owner-read",
    Body: stream,
    Bucket: "riffraff-artifact",
    Key: path
  }).promise;
};

export const uploadAction = (manifest:Manifest, action:Action) => {
  let stream = null;
  if(action.compress){
  
  } else {
    stream = createReadStream
  }

}

const uploadCompressed = (manifest:Manifest, action:Action & {compress: Format}) => {
  const stream = new Duplex()
  compressToStream(action.path,action.compress,stream)
  return uploadStream('',stream,manifest)
}

