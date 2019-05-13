#! /usr/bin/env node

const riffraff = require("./lib/index")
riffraff.deploy().then(()=>{
  console.log("Upload complete.")
})