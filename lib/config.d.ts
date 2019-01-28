import { Manifest } from "./manifest";
export interface Action {
    action: string;
    path: string;
    compress: false | "zip" | "tar";
}
declare type environment = "circle-ci" | "travis-ci" | "jenkins" | "teamcity" | "dev";
export declare const getBranchName: (env: environment) => string | undefined;
export declare const getVcsRevision: (env: environment) => string | undefined;
export declare const getBuildId: (env: environment) => string | undefined;
export declare const generateManifest: (projectName: string, vcsURL: string) => Manifest;
export {};
