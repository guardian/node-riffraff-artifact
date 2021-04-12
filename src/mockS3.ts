import { S3 } from "aws-sdk";
import temp from "temp";
import { createWriteStream, mkdirSync, promises as fsPromises } from "fs";
import path from "path";
import { Stream } from "stream";
import { promises } from "dns";

const isStream = (candidate: S3.Body): candidate is Stream => {
  if (candidate == null) return false;
  return (
    typeof candidate === "object" &&
    "pipe" in candidate &&
    typeof candidate.pipe === "function"
  );
};
class MockS3 {
  dir: string;
  constructor() {
    this.dir = temp.mkdirSync();
    console.log(`Creating temporary directory at ${this.dir}`);
    process.on("beforeExit", () => {
      console.log(`Temporary directory created at ${this.dir}`);
    });
  }
  upload({ Key, Bucket, Body }: S3.Types.PutObjectRequest): S3.ManagedUpload {
    const filePath = path.resolve(this.dir, Bucket, Key);
    mkdirSync(path.dirname(filePath), { recursive: true });

    if (!Body || !isStream(Body)) {
      return {
        promise: async (): Promise<S3.ManagedUpload.SendData> => {
          await fsPromises.writeFile(filePath, Body);
          return {
            Location: "TEST",
            Key,
            Bucket: "TEST",
            ETag: ""
          };
        },
        abort: (): void => console.error("not supported."),
        send: (): void => console.error("not supported."),
        on: (): void => console.error("not supported.")
      };
    }

    return {
      promise: (): Promise<S3.ManagedUpload.SendData> =>
        new Promise<S3.ManagedUpload.SendData>(resolve => {
          const writeStream = createWriteStream(filePath);
          Body.pipe(writeStream);
          Body.on("end", () => {
            writeStream.close();
            resolve({
              Location: "TEST",
              Key,
              Bucket: "TEST",
              ETag: ""
            });
          });
        }),
      abort: (): void => console.error("not supported."),
      send: (): void => console.error("not supported."),
      on: (): void => console.error("not supported.")
    };
  }
}

export const mock = (): S3 => (new MockS3() as unknown) as S3;
