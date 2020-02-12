#! /usr/bin/env node

const yargs = require("yargs");
const argv = yargs.argv;

if (argv.import) {
  console.log("Attempting to import existing project.");
  const { importer } = require("./lib/import");
  const artifacts = importer();
  console.log("Save the following to artifact.json:");
  console.warn(JSON.stringify(artifacts, null, 2));
  process.exit(0);
}

const dryRun = argv.dryRun || false;

if (dryRun) {
  console.warn("Running locally.");
}
const riffraff = require("./lib/index");
riffraff
  .deploy(dryRun)
  .then(() => {
    console.log("Upload complete.");
  })
  .catch(error => {
    console.error("Upload failed. ");
    console.error(error);
    process.exit(1);
  });
