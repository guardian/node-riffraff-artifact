import { Manifest } from "./manifest";

export interface Action {
  action: string;
  path: string;
  compress: false | "zip" | "tar";
}

type environment = "circle-ci" | "travis-ci" | "jenkins" | "teamcity" | "dev";

const determineEnvironment = (): environment => {
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
};

export const getBranchName = (env: environment): string | undefined => {
  switch (env) {
    case "circle-ci":
      return process.env.CIRCLE_BRANCH;

    case "travis-ci":
      return process.env.TRAVIS_PULL_REQUEST === "false"
        ? process.env.TRAVIS_BRANCH
        : process.env.TRAVIS_PULL_REQUEST;

    case "jenkins":
      return process.env.GIT_BRANCH;

    case "teamcity":
      return (process.env.TEAMCITY_BRANCH || process.env.BRANCH_NAME || "")
        .split("/")
        .slice(-1)[0];

    default:
      return undefined;
  }
};

export const getVcsRevision = (env: environment): string | undefined => {
  switch (env) {
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

export const getBuildId = (env: environment): string | undefined => {
  switch (env) {
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

export const generateManifest = (
  projectName: string,
  vcsURL: string
): Manifest => {
  const env = determineEnvironment();
  const buildNumber = getBuildId(env) || "dev";
  const branch = getBranchName(env) || "dev";
  const revision = getVcsRevision(env) || "dev";
  return { buildNumber, branch, revision, projectName, vcsURL };
};
