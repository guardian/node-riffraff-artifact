import {  uploadManifest } from './manifest';
import { generateManifest } from './config';

const deploy = async () => {
  const projectName = "";
  const vcsURL = "";

  const manifest = generateManifest(projectName, vcsURL);

  
  // upload each action
  // upload rr.y
  // upload build.json
  await uploadManifest(manifest);
};
