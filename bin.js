#! /usr/bin/env node
console.log(process.argv);

if (process.argv[2] === "import") {
  const { importer } = require("./lib/import");

  importer().then(actions => {
    console.log(JSON.stringify(actions, null, 2));
  });
} else {
  const riffraff = require("./lib/index");
  riffraff
    .deploy()
    .then(() => {
      console.log("Upload complete.");
    })
    .catch(error => {
      console.error("Upload failed. ");
      console.error(error);
      process.exit(1);
    });
}
