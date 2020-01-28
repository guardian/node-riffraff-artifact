import { Action } from "./environment";
import {
  Decoder,
  object,
  string,
  array,
  optional,
  union,
  constant
} from "@mojotech/json-type-validation";
import { readFile } from "fs";

export interface Settings {
  projectName: string;
  vcsURL?: string;
  actions: Action[];
}

const settingsPath = "./artifact.json";

const read: () => Promise<string> = () =>
  new Promise((resolve, reject) => {
    readFile(settingsPath, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.toString());
    });
  });

const decoder: Decoder<Settings> = object({
  projectName: string(),
  vcsURL: optional(string()),
  actions: array(
    object({
      action: string(),
      path: string(),
      compress: union(
        constant<false>(false),
        constant<"zip">("zip"),
        constant<"tar">("tar")
      )
    })
  )
});

export const getConfig = async (): Promise<Settings> => {
  const file = await read();
  const json = JSON.parse(file);
  return decoder.runPromise(json);
};
