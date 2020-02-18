import { readFileSync } from "fs";
import YAML from "yaml";
import { Settings } from "./settings";

const pjson = process.argv[3] || "package.json";
const ryaml = process.argv[4] || "riff-raff.yaml";

const readPackage: () => {
  name: string;
  projectName?: string;
  repository?: string;
  cloudformation?: false | string;
  buildDir?: string;
} = () => JSON.parse(readFileSync(pjson).toString());

const readRiffRaff: () => {
  deployments: { [key: string]: { type: string } };
} = () => YAML.parse(readFileSync(ryaml).toString());

export const importer = (): Partial<Settings> => {
  const pkg = readPackage();
  const riffraff = readRiffRaff();
  const repository = pkg.repository || "your github url";
  const projectName = pkg.projectName || pkg.name;
  const cloudformation = pkg.cloudformation;
  const buildDir = pkg.buildDir;
  const deployments = Object.keys(riffraff.deployments);
  const actions = deployments.map(deployment => ({
    action: deployment,
    path: cloudformation || buildDir || "",
    compress: cloudformation ? (false as const) : ("zip" as const)
  }));
  return {
    projectName,
    vcsURL: repository,
    actions
  };
};
