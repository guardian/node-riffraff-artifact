import { Manifest } from "./manifest";
import simplegit = require("simple-git/promise");
import { Settings } from "./settings";

export interface Action {
  action: string;
  path: string;
  compress: false | "zip" | "tar";
}
const git = simplegit();

type CiPlatform = "circle-ci" | "travis-ci" | "jenkins" | "teamcity" | "dev";
interface Environment {
  ci: CiPlatform;
  git: boolean;
}

export const determineEnvironment = async (): Promise<Environment> => {
  const isRepo = git.checkIsRepo();
  return {
    ci: (() => {
      if (process.env.CIRCLECI && process.env.CI) {
        return "circle-ci";
      } else if (process.env.TRAVIS && process.env.CI) {
        return "travis-ci";
      } else if (process.env.JENKINS_URL) {
        return "jenkins";
      } else if (process.env.TEAMCITY_VERSION) {
        return "teamcity";
      } else {
        return "dev";
      }
    })(),
    git: await isRepo
  };
};

export const getBranchName = async (env: Environment) => {
  if (env.git) {
    const branches = await git.branchLocal();
    return branches.current;
  }
  switch (env.ci) {
    case "circle-ci":
      return process.env.CIRCLE_BRANCH;

    case "travis-ci":
      return process.env.TRAVIS_PULL_REQUEST === "false"
        ? process.env.TRAVIS_BRANCH
        : process.env.TRAVIS_PULL_REQUEST;

    case "jenkins":
      return process.env.GIT_BRANCH;

    case "teamcity":
      return (process.env.TEAMCITY_BRANCH || "").split("/").slice(-1)[0];

    default:
      return undefined;
  }
};

export const getVcsRevision = async (env: Environment) => {
  if (env.git) {
    return git.revparse(["HEAD"]);
  }
  switch (env.ci) {
    case "circle-ci":
      return process.env.CIRCLE_SHA1;

    case "travis-ci":
      return process.env.TRAVIS_COMMIT;

    case "jenkins":
      return process.env.GIT_COMMIT;

    case "teamcity":
      return process.env.BUILD_VCS_NUMBER;

    default:
      return undefined;
  }
};

export const getBuildId = ({ ci }: Environment) => {
  switch (ci) {
    case "circle-ci":
      return process.env.CIRCLE_BUILD_NUM;

    case "travis-ci":
      return process.env.TRAVIS_BUILD_NUMBER;

    case "jenkins":
      return process.env.BUILD_NUMBER;

    case "teamcity":
      return process.env.BUILD_NUMBER;
    default:
      return undefined;
  }
};

const getVcsURL = async (env: Environment, maybeURL: string | undefined) => {
  if (env.git) {
    const remotes = await git.getRemotes(true);
    const origin = remotes.find(remote => remote.name === "origin");
    if (origin) {
      return origin.refs.fetch;
    }
  }
  return maybeURL || "https://gu.com";
};

export const generateManifest = async ({
  projectName,
  vcsURL: maybeURL
}: Settings): Promise<Manifest> => {
  const env = await determineEnvironment();
  const buildNumber = (await getBuildId(env)) || "dev";
  const branch = (await getBranchName(env)) || "dev";
  const revision = (await getVcsRevision(env)) || "dev";
  const vcsURL = await getVcsURL(env, maybeURL);
  return { buildNumber, branch, revision, projectName, vcsURL };
};
