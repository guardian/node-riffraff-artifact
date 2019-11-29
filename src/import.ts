import { readFile } from "fs";
import YAML from "yaml";
import { promisify } from 'util'
import { exec as execCB } from 'child_process'
const exec = promisify(execCB)

const pjson = process.argv[3] || "package.json";
const ryaml = process.argv[4] || "riff-raff.yaml";

const readPackage: () => Promise<{
  name: string;
  projectName?: string;
  repository?: string;
  cloudformation?: false | string;
  buildDir?: string;
}> = () =>
    new Promise((resolve, reject) => {
      readFile(pjson, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(data.toString()));
      });
    });

const readRiffRaff: () => Promise<{
  deployments: { [key: string]: { type: string } };
}> = () =>
    new Promise((resolve, reject) => {

      readFile(ryaml, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(YAML.parse(data.toString()));
      });
    });

export const importer = async () => {
  const pkg = await readPackage();
  const riffraff = await readRiffRaff();
  const repository = pkg.repository || "your github url";
  const projectName = pkg.projectName || pkg.name;
  const cloudformation = pkg.cloudformation;
  const buildDir = pkg.buildDir;
  const deployments = Object.keys(riffraff.deployments);
  const actions = deployments.map(deployment => ({
    action: deployment,
    path: cloudformation || buildDir || "",
    compress: cloudformation ? false : "zip"
  }));
  return {
    projectName,
    vcsURL: repository,
    actions
  };
};
