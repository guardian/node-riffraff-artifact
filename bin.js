#! /usr/bin/env node
const running = true
const wait = () => { if (running) setTimeout(wait, 100) }
const riffraff = require("./lib/index")
riffraff.deploy().then(() => {
  console.log("Upload complete.")
  running = false
}).catch((error) => {
  console.error("Upload failed. ")
  console.error(error)
  process.exit(1)
})