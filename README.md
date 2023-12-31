# publish-gitlab-release

`publish-gitlab-release` is a command-line tool designed to simplify the process of creating a Git tag and a corresponding GitLab release.

The tool automates the collection of commits made since the last tag, along with all associated merge requests and their linked issues.
It also adds comments to merge requests and their linked issues, providing better visibility into the changes included in each release.
Additionally, it generates a basic changelog based on raw commit messages.

Unlike some other tools like [semantic release](https://github.com/semantic-release/semantic-release), `publish-gitlab-release` doesn't enforce a specific versioning scheme. It is flexible and works exclusively with GitLab via their API.

## 🌟 Features

- Create a Git tag and publish a GitLab release with a single command.
- Automatically add comments to Merge Requests and their linked issues for better visibility.
- Generate a basic changelog for the GitLab release.

## 🧰 Requirements

- Node 18 (or higher)
- Gitlab
- Your latest Git tag is always the tag since last release

## 🚀 Usage

To use `publish-gitlab-release`, invoke it using npx with the desired version number:

```bash
npx publish-gitlab-release -v "1.2.3" [options]
```

### 🛠️ Options

#### `-v, --version` _(required)_

Specifies the version name to be used for the Git tag and the Gitlab release. This option is required and should be used to define the version of the release.

#### `-t, --token` _(required)_

Gitlab API token. Unfortunately the `CI_JOB_TOKEN` has not enough rights, so that a personal access token or a project access token is required. Go to your project settings and then _Access Tokens_. Create a token with the scope _api_ and add it to _variables_ under the section _CI/CD_.

#### `--ref` _(optional)_

Git ref that should be tagged. If provided, the specified Git ref will be tagged with the version defined using the `-v` option. If not provided, the tool will use the given environment variable `CI_COMMIT_SHA` from Gitlab pipelines.

#### `--host` _(optional)_

Gitlab URI. Use this option to specify a custom Gitlab host URL. Within Gitlab pipelines the tool will use the environment variables `CI_SERVER_PROTOCOL`, `CI_SERVER_HOST` and `CI_SERVER_PORT`. Fallback is `gitlab.com`.

#### `--project` _(optional)_

Gitlab project ID. Use this option to specify the ID of the Gitlab project where the release should be published. If not provided, the tool will use the given variable `CI_PROJECT_ID` from Gitlab pipelines.

## 💻 CI example

```yml
publish-release:
  image: node:20.4.0
  script:
    - npx publish-gitlab-release --version "$VERSION" --token "$GITLAB_RELEASE_TOKEN"
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH && $CI_COMMIT_TAG == null'
```

![Gitlab comment on a issue referring to a Gitlab release](./docs/issue-comment.png 'Gitlab comment on a issue')
![Gitlab comment on a merge request referring to a Gitlab release](./docs/issue-merge-request.png 'Gitlab comment on a merge request')

## 👏 Credits

- [semantic release](https://github.com/semantic-release/semantic-release) A powerful release publishing tool with extensive plugin support, automating versioning and publishing based on commit history
- [@gitbeaker/rest](https://www.npmjs.com/package/@gitbeaker/rest) provides typed access to the Gitlab API, enhancing our project's capabilities
- blog post [Actually you don’t need 'semantic-release' for semantic release](https://dev.to/antongolub/you-don-t-need-semantic-release-sometimes-3k6k) inspired the creation of this tool, tailored to my specific needs
