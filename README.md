# node-riffraff-artifact

This module takes artifacts and uploads them to riff-raff for deployment.

## How to use

Install `@guardian/node-riffraff-artifact`.
`yarn add --dev @guardian/node-riffraff-artifact`

This can also be used from `npx` or `yarn dlx` without installation.

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

Run `node-riffraff-artifact` as a yarn script, this will upload your `riff-raff.yaml` file to S3, generate and upload a `build.json`, and each action to the artifact bucket.

This can be run with a flag `--dryRun` which will use a local s3 mock. This will create a temporary directory and place the deployed files in there.

### Within GitHub Actions
`node-riffraff-artifact` will upload files to S3. When run in TeamCity, we gain credentials via TeamCity's `InstanceProfile` policy.

To give GitHub Actions permissions to upload to S3 use the [`@guardian/actions-assume-aws-role` Action](https://github.com/guardian/actions-assume-aws-role).
Ensure you use the Action before `node-riffraff-artifact`.
A secret (`GU_RIFF_RAFF_ROLE_ARN`) has been added Guardian GitHub organisation that can be used for the value of `awsRoleToAssume`.

For example:
```yaml
name: CI
on:
  pull_request:
  push:
    branches:
      - main
jobs:
  CI:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    strategy:
      matrix:
        node-version: [14.17.4]
    steps:
      - uses: actions/checkout@v2
      - uses: guardian/actions-assume-aws-role@v1
        with:
          awsRoleToAssume: ${{ secrets.GU_RIFF_RAFF_ROLE_ARN }}
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v2.4.0
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm run node-riffraff-artifact
```

### Migrating from node-riffraff-artefact

If your project uses [node-riffraff-artefact](https://github.com/guardian/node-riffraff-artefact) (with an e), then you can run
`yarn node-riffraff-artifact --import` which will make some guesses about what should be in your `artifact.json` file.

If you're happy with the output suggested, this can be copied to `artifact.json` or you could run `yarn node-riffraff-artifact --import 2> artifact.json`.

It is likely that node-riffraff-artefact was run with an argument to select what is uploaded. You will need to change `path` to reflect this.

You can then delete all the node-riffraff-artefact specific entries from your package.json.

### Warning

It's strongly reccomended to not use `path: '.'` as this will include your node_modules directory, including all development dependencies. Instead consider [@zeit/ncc](https://github.com/zeit/ncc), which can be used with the flags `-m -e aws-sdk` to minify and also to exclude the aws-sdk, which is included in the lambda runtime.
You may have to change your build process if you were previously uploading `.`.
