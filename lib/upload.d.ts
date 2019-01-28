/// <reference types="node" />
import { S3 } from "aws-sdk";
import { Readable } from "stream";
import { Deployment } from "./config";
export declare const upload: (stream: Readable, deployment: Deployment, name: string) => () => Promise<S3.ManagedUpload.SendData>;
