import { S3 } from "aws-sdk";

export interface Manifest {
  branch: string;
  vcsURL: string;
  revision: string;
  buildNumber: string;
  projectName: string;
}
const s3 = new S3();

export const uploadManifest = (manifest: Manifest) => {
  const manifestWithDate = { ...manifest, startTime: new Date().toISOString() };
  const manifestString = JSON.stringify(manifestWithDate);
  return s3.upload({
    Bucket: "alex-w-test-bucket-2",
    // Bucket: "riffraff-builds",
    Body: manifestString,
    Key: `${manifest.projectName}/${manifest.buildNumber}/build.json`
  }).promise;
};
