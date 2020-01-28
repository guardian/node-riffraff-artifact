#! /usr/bin/env node

const yargs = require("yargs");
const argv = yargs.argv;

if (argv.import) {
  const { importer } = require("./lib/import");

  importer().then(actions => {
    console.log(JSON.stringify(actions, null, 2));
  });
  process.exit(0);
}

const dryRun = argv.dryRun || false;
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
