"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const s3 = new aws_sdk_1.S3({
    region: "eu-west-1"
});
exports.upload = (stream, deployment, name) => {
    const path = [deployment.project, deployment.build, deployment.action, name].filter(_ => _ != null).join('/');
    return s3.upload({
        ACL: "bucket-owner-read",
        Body: stream,
        Bucket: "riffraff-artifact",
        Key: path
    }).promise;
};
