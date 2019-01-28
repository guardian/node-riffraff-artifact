"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const archiver = require("archiver");
const fs_1 = require("fs");
const fileOrDirectory = (path) => new Promise((resolve, reject) => {
    fs_1.lstat(path, (err, stats) => {
        if (err) {
            console.error("Could not access", path);
            console.error(err);
            reject(err);
            return;
        }
        if (stats.isDirectory()) {
            resolve('directory');
            return;
        }
        if (stats.isFile()) {
            resolve('file');
            return;
        }
        console.error(`${path} must either be a file or directory`);
        reject();
    });
});
exports.compressToStream = async (path, method, stream) => {
    const archive = archiver(method);
    archive.on("warning", err => {
        console.log("Error in attempting to compress", path, err);
    });
    archive.pipe(stream);
    const fileOrDir = await fileOrDirectory(path);
    if (fileOrDir === 'directory') {
        archive.directory(path, false);
    }
    if (fileOrDir === 'file') {
        const splitPath = path.split('/');
        const name = splitPath[splitPath.length - 1];
        archive.file(path, { name });
    }
    archive.finalize();
};
