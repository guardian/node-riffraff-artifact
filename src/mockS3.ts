import AWSMock from "mock-aws-s3";
import { S3 } from "aws-sdk";

import { join } from "path";

export const mock = (): S3 => {
  AWSMock.config.basePath = join(process.cwd(), "tmp");
  return new AWSMock.S3();
};
