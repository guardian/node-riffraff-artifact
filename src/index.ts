import { uploadManifest } from "./manifest";
import { generateManifest, Action } from "./environment";
import { uploadAction, upload } from "./upload";
import { createReadStream } from "fs";
import { getConfig, Settings } from "./settings";
import { join } from "path";
import AWSMock from "mock-aws-s3";
import { S3 } from "aws-sdk";

export const deployWithConf = async (conf: Settings, s3: S3) => {
  const projectName = conf.projectName;
  const vcsURL = conf.vcsURL || "https://gu.com";
  const actions: Action[] = conf.actions;

  const manifest = generateManifest(projectName, vcsURL);
  console.log("build.json:", manifest);
  // upload each action
  await Promise.all(
    actions.map(action => {
      return uploadAction(s3, manifest, action);
    })
  );

  // upload riff-raff.yaml
  await upload(
    s3,
    "riff-raff.yaml",
    createReadStream("riff-raff.yaml"),
    manifest
  );
  // upload build.json
  await uploadManifest(s3, manifest);

  return true;
};

export const mockS3 = () => {
  AWSMock.config.basePath = join(process.cwd(), "tmp");
  return new AWSMock.S3();
};

export const deploy = async (dryRun: boolean) => {
  const s3: S3 = dryRun
    ? mockS3()
    : new S3({
        region: "eu-west-1"
      });

  const conf = await getConfig();
  return deployWithConf(conf, s3);
};
