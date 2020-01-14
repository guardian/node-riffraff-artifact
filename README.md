# node-riffraff-artifact

This module takes artifacts and uploads them to riff-raff for deployment.

## How to use

Install `@guardian/node-riffraff-artifact`.

This can also be used from npx `npx @guardian/node-riffraff-artifact` without installation.

Create a file named `artifact.json` in the same directory as your `package.json`.

```json
{
  "projectName": "(name of your project)",
  "vcsURL": "(github url)",
  "actions": [
    {
      "action": "(the name of the deployment in riffraff)",
      "path": "(each individual deployment from your riff-raff.yaml file)",
      "compress": "('zip' or 'tar' or false)"
    }
  ]
}
```

If your project uses [node-riffraff-artefact](https://github.com/guardian/node-riffraff-artefact) (with an e), then you can run
`npx @guardian/node-riffraff-artifact import` which will make some semi-intelligent guesses about what should be in your `artifact.json` file.
You can then delete all the node-riffraff-artefact specific entries from your package.json.

Run `node-riffraff-artifact` as a yarn script, this will upload your `riff-raff.yaml` file to S3, generate and upload a `build.json`, and each action to the artifact bucket.
