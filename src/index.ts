import { uploadManifest } from "./manifest";
import { generateManifest, Action } from "./environment";
import { uploadAction, uploadStream } from "./upload";
import { createReadStream } from "fs";
import { getConfig } from "./settings";

export const deploy = async () => {
  const conf = await getConfig();

  const projectName = conf.projectName;
  const vcsURL = conf.vcsURL || "https://gu.com";
  const actions: Action[] = conf.actions;

  const manifest = generateManifest(projectName, vcsURL);
  console.log("build.json:", manifest);
  // upload each action
  await Promise.all(
    actions.map(action => {
      return uploadAction(manifest, action);
    })
  );

  // upload riff-raff.yaml
  await uploadStream(
    "riff-raff.yaml",
    createReadStream("riff-raff.yaml"),
    manifest
  );
  // upload build.json
  await uploadManifest(manifest);
  return true;
};
