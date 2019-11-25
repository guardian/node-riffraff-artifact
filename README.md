# node-riffraff-artifact

This module takes artifacts and uploads them to riff-raff for deployment.

## How to use

Install `@guardian/node-riffraff-artifact`

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

This will upload your `riff-raff.yaml` file to S3, generate and upload a `build.json`, and each action to the artifact bucket.
