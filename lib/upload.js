"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const stream_1 = require("stream");
const bundle_1 = require("./bundle");
const fs_1 = require("fs");
const s3 = new aws_sdk_1.S3({
    region: "eu-west-1"
});
exports.uploadStream = (name, stream, manifest, action) => {
    const path = [
        manifest.projectName,
        manifest.buildNumber,
        action && action.action,
        name
    ]
        .filter(_ => _ != null)
        .join("/");
    return s3
        .upload({
        ACL: "bucket-owner-read",
        Body: stream,
        Bucket: "riffraff-artifact",
        Key: path
    })
        .promise();
};
exports.uploadAction = (manifest, action) => {
    const stream = null;
    if (action.compress) {
        return uploadCompressed(manifest, action); // we know this isn't false ;_;
    }
    return uploadMany(manifest, action);
};
const uploadMany = async (manifest, action) => {
    const files = await bundle_1.getAllFiles(action.path);
    const uploads = files.map(file => {
        const stream = fs_1.createReadStream(file);
        return exports.uploadStream(file, stream, manifest, action);
    });
    return Promise.all(uploads);
};
const uploadCompressed = (manifest, action) => {
    if (!action.compress) {
        throw new Error("Attempted to compress something when compress was false.");
    }
    const stream = new stream_1.Duplex();
    bundle_1.compressToStream(action.path, action.compress, stream);
    return exports.uploadStream("", stream, manifest);
};
