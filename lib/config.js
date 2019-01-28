"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const determineEnvironment = () => {
    if (process.env.CIRCLECI && process.env.CI) {
        return "circle-ci";
    }
    else if (process.env.TRAVIS && process.env.CI) {
        return "travis-ci";
    }
    else if (process.env.JENKINS_URL) {
        return "jenkins";
    }
    else if (process.env.TEAMCITY_VERSION) {
        return "teamcity";
    }
    else {
        return "dev";
    }
};
exports.getBranchName = (env) => {
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
            return (process.env.TEAMCITY_BRANCH || "").split("/").slice(-1)[0];
        default:
            return undefined;
    }
};
exports.getVcsRevision = (env) => {
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
exports.getBuildId = (env) => {
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
exports.generateManifest = (projectName, vcsURL) => {
    const env = determineEnvironment();
    const buildNumber = exports.getBuildId(env) || "dev";
    const branch = exports.getBranchName(env) || "dev";
    const revision = exports.getVcsRevision(env) || "dev";
    return { buildNumber, branch, revision, projectName, vcsURL };
};
