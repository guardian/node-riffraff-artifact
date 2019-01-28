import { uploadManifest } from "./manifest";
import { generateManifest } from "./config";
import { getAllFiles } from "./bundle";
import { Action } from "../lib/config";
import { uploadAction, uploadStream } from "./upload";
import { createReadStream } from "fs";

const deploy = async () => {
  const projectName = "";
  const vcsURL = "";
  const actions: Action[] = [
    {
      action: "build",
      path: "folder",
      compress: false
    }
  ];
  const manifest = generateManifest(projectName, vcsURL);
  console.log(manifest);
  // upload each action
  await Promise.all(
    actions.map(action => {
      return uploadAction(manifest, action);
    })
  );

  // upload rr.y
  await uploadStream(
    "riff-raff.yml",
    createReadStream("riff-raff.yml"),
    manifest
  );
  // upload build.json
  await uploadManifest(manifest);
  return true;
};

deploy().then(_ => console.log("hi"));
