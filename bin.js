#! /usr/bin/env node

const riffraff = require("./lib/index")
riffraff.deploy().then(() => {
  console.log("Upload complete.")
}).catch((error) => {
  console.error("Upload failed. ")
  console.error(error)
  process.exit(1)
})