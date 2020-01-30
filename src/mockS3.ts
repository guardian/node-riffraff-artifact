import AWSMock from "mock-aws-s3";
import { S3 } from "aws-sdk";
import temp from "temp";

export const mock = (): S3 => {
  const dir = temp.mkdirSync();
  console.log(`Creating temporary directory at ${dir}`);
  process.on("beforeExit", () => {
    console.log(`Temporary directory created at ${dir}`);
  });
  AWSMock.config.basePath = dir;
  return new AWSMock.S3();
};
