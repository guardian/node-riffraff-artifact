/// <reference types="node" />
import archiver = require("archiver");
import { Writable } from "stream";
export declare const compressToStream: (path: string, method: archiver.Format, stream: Writable) => Promise<void>;
