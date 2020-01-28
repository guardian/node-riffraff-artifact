import { S3 } from "aws-sdk";

export interface Manifest {
  branch: string;
  vcsURL: string;
  revision: string;
  buildNumber: string;
  projectName: string;
}

export const uploadManifest = async (s3: S3, manifest: Manifest) => {
  const manifestWithDate = { ...manifest, startTime: new Date().toISOString() };
  console.log("Generated build.json");
  console.log(manifestWithDate);
  const manifestString = JSON.stringify(manifestWithDate);
  const path = `${manifest.projectName}/${manifest.buildNumber}/build.json`;
  const upload = await s3
    .upload({
      Bucket: "riffraff-builds",
      Body: manifestString,
      Key: path
    })
    .promise();
  console.log("Uploaded build.json to riffraff-builds ", path);
  return upload;
};
