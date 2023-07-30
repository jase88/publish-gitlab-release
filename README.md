# publish-gitlab-release

`publish-gitlab-release` is a CLI tool designed to streamline the process of creating a Git tag and a corresponding GitLab release.

It automates the collection of commits since the last tag, as well as all associated _merge requests_ and their linked _issues_.

The tool also facilitates adding comments to merge requests and their linked issues, providing better visibility into the changes included in each release.
Additionally, it generates a basic changelog based on raw commit messages.

These features are all also available in tools like [semantic release](https://github.com/semantic-release/semantic-release), but the difference is that those enforce you to use semantiv versioning.
This tool doesn't care about your versioning scheme and only works for Gitlab via their API.

## 🌟 Features

- Create a git tag and publish a gitlab release
- Release comment on Merge Requests and their linked issues
- Basic Changelog on Gitlab Release

## 🚀 Usage

To use publish-gitlab-release, you can easily invoke it with npx as follows:

```bash
npx publish-gitlab-release -v "1.2.3" [options]
```

### 🛠️ Options

#### `-v, --version` _(required)_

Specifies the version name to be used for the Git tag and the Gitlab release. This option is required and should be used to define the version of the release.

#### `-t, --token` _(optional)_

Gitlab API token. If provided, the tool will use this token to authenticate with Gitlab when creating the release. If not provided, the tool will attempt to use the environment variable `GITLAB_PROJECT_TOKEN` within Gitlab pipelines.

#### `--ref` _(optional)_

Git ref that should be tagged. If provided, the specified Git ref will be tagged with the version defined using the `-v` option. If not provided, the tool will use the given environment variable `CI_COMMIT_SHA` from Gitlab pipelines.

#### `--host` _(optional)_

Gitlab URI. Use this option to specify a custom Gitlab host URL. Within Gitlab pipelines the tool will use the environment variables `CI_SERVER_PROTOCOL`, `CI_SERVER_HOST` and `CI_SERVER_PORT`. Fallback is `gitlab.com`.

#### `--project` _(optional)_

Gitlab project ID. Use this option to specify the ID of the Gitlab project where the release should be published. If not provided, the tool will use the given variable `CI_PROJECT_ID` from Gitlab pipelines.

## 🧰 Requirements

- Node 18 (or higher)
- Gitlab
