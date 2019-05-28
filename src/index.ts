import { uploadManifest } from "./manifest";
import { generateManifest, Action, determineEnvironment } from "./environment";
import { uploadAction, upload } from "./upload";
import { createReadStream } from "fs";
import { getConfig, Settings } from "./settings";

export const deployWithConf = async (conf: Settings, riffRaffYaml?: string) => {
  const projectName = conf.projectName;
  const actions: Action[] = conf.actions;
  const manifest = await generateManifest(conf);
  console.log("build.json:", manifest);
  // upload each action
  await Promise.all(
    actions.map(action => {
      return uploadAction(manifest, action);
    })
  );

  // upload riff-raff.yaml
  await upload(
    "riff-raff.yaml",
    riffRaffYaml ?? createReadStream("riff-raff.yaml"),
    manifest
  );
  // upload build.json
  await uploadManifest(manifest);

  return true;
};

export const deploy = async () => {
  const conf = await getConfig();
  return deployWithConf(conf);
};
