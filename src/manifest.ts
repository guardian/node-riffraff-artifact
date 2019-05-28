import { S3 } from "aws-sdk";

export interface Manifest {
  branch: string;
  vcsURL: string;
  revision: string;
  buildNumber: string;
  projectName: string;
}
const s3 = new S3({
  region: "eu-west-1"
});

export const uploadManifest = async (manifest: Manifest) => {
  const manifestWithDate = { ...manifest, startTime: new Date().toISOString() };
  const manifestString = JSON.stringify(manifestWithDate);
  const path = `${manifest.projectName}/${manifest.buildNumber}/build.json`;
  const upload = await s3
    .upload({
      Bucket: "riffraff-builds",
      Body: manifestString,
      Key: path
    })
    .promise();
  console.log("Uploaded build.json to", path);
  return upload;
};
