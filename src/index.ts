import { uploadManifest } from "./manifest";
import { generateManifest } from "./config";
import { getAllFiles } from "./bundle";

const deploy = async () => {
  const projectName = "";
  const vcsURL = "";

  const manifest = generateManifest(projectName, vcsURL);
console.log(manifest)
  // upload each action
  // upload rr.y
  // upload build.json
  // await uploadManifest(manifest);
  // const files = getAllFiles(".");
  // console.log(files);
};

deploy().then(_ => console.log("hi"));
