/// <reference types="node" />
import { S3 } from "aws-sdk";
import { Readable } from "stream";
import { Action } from "./config";
import { Manifest } from "./manifest";
export declare const uploadStream: (name: string, stream: Readable, manifest: Manifest, action?: Action | undefined) => Promise<S3.ManagedUpload.SendData>;
export declare const uploadAction: (manifest: Manifest, action: Action) => Promise<S3.ManagedUpload.SendData> | Promise<S3.ManagedUpload.SendData[]>;
