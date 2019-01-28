import { Deployment } from "./config";
import { S3 } from "aws-sdk";
export interface BuildManifest {
    branch: string;
    vcsURL: string;
    revision: string;
    startTime: string;
    buildNumber: string;
    projectName: string;
}
export declare const uploadManifest: (manifest: BuildManifest, deployment: Deployment) => () => Promise<S3.ManagedUpload.SendData>;
