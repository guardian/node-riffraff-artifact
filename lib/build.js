"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
exports.uploadManifest = (manifest, deployment) => {
    const manifestString = JSON.stringify(manifest);
    const s3 = new aws_sdk_1.S3({ region: deployment.region });
    return s3.upload({
        Bucket: "riffraff-builds",
        Body: manifestString,
        Key: `${deployment.project}/${deployment.build}/build.json`
    }).promise;
};
