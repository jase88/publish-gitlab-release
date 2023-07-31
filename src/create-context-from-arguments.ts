import { parseArgs } from 'node:util';
import { env, exit } from 'node:process';
import { Gitlab } from '@gitbeaker/rest';
import { Context } from './types';

export function validateArguments({ version, token, projectId, ref, host }) {
  if (!version) {
    throw new Error(
      `No valid version found. You need to provide a version name that is the name of the git tag and the Gitlab release`
    );
  }

  if (!token) {
    throw new Error(
      `No valid token found - please make sure to pass in a token or set the environment variable "GITLAB_PROJECT_TOKEN"`
    );
  }

  if (!projectId || !Number.isInteger(projectId)) {
    throw new Error(
      `No valid project iid found - please make sure to pass in a project`
    );
  }

  if (!ref) {
    throw new Error(
      `No valid git ref given for which hash a release should be created`
    );
  }

  console.info(`using host "${host}" for project ${projectId}`);
}

export function createContextFromArguments(): Context {
  const {
    CI_PROJECT_ID,
    CI_SERVER_PROTOCOL,
    CI_SERVER_HOST,
    CI_SERVER_PORT,
    CI_COMMIT_SHA,
  } = env;

  const {
    values: {
      version,
      help,
      host: gitlabHost,
      token: gitlabToken,
      project: gitlabProjectId,
      ref: gitReference,
    },
  } = parseArgs({
    options: {
      version: {
        type: 'string',
        short: 'v',
      },
      host: {
        type: 'string',
      },
      ref: {
        type: 'string',
      },
      project: {
        type: 'string',
      },
      token: {
        type: 'string',
        short: 't',
      },
      help: {
        type: 'boolean',
        short: 'h',
      },
    },
  });

  if (help) {
    console.log(`Usage: publish-gitlab-release [options]

Description:
  Publishes a release on Gitlab and creates a corresponding Git tag.

  Options:
    -v, --version <version>   Specifies the version name to be used for the Git tag and the Gitlab release.
    -t, --token <token>       Gitlab API token. Personal or project access token.
    --ref <ref>               (Optional) Git ref that should be tagged. If not provided, the tool will use the given environment variable CI_COMMIT_SHA from Gitlab pipelines.
    --host <host>             (Optional) Gitlab URI. If not specified, the tool will default to gitlab.com.
    --project <project_id>    (Optional) Gitlab project ID. If not specified, the tool will use the given variable CI_PROJECT_ID from Gitlab pipelines.

    -h, --help                Show this help message and exit.`);
    exit(0);
  }

  const host =
    gitlabHost || (CI_SERVER_PROTOCOL && CI_SERVER_HOST && CI_SERVER_PORT)
      ? `${CI_SERVER_PROTOCOL}://${CI_SERVER_HOST}:${CI_SERVER_PORT}`
      : 'gitlab.com';
  const projectId = Number.parseInt(gitlabProjectId || CI_PROJECT_ID, 10);
  const reference = gitReference || CI_COMMIT_SHA;

  validateArguments({
    version,
    token: gitlabToken,
    projectId,
    ref: reference,
    host,
  });

  const api = new Gitlab({ host, token: gitlabToken });

  return { api, host, projectId, version, reference };
}
