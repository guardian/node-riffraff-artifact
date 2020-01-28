#! /usr/bin/env node

const argv = require("yargs").argv;

console.log(argv);

if (argv.help) {
  console.log(`
  Welcome to node riffraff artifact.
  Please use --import to import a legacy project.
  Please use --dryRun to not upload to s3.
  `);
}

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
