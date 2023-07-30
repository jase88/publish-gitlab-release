import { GitlabApi, GitlabProjectId } from './types';

export async function getLatestTagHash(
  { Tags }: GitlabApi,
  projectId: GitlabProjectId
): Promise<string | undefined> {
  const tags = await Tags.all(projectId, { perPage: 1, page: 1 });
  const [latestTag] = tags;

  if (!latestTag) {
    return undefined;
  }

  console.info(
    `identified latest tag "${latestTag.name}" "${latestTag.commit.id}"`
  );

  return latestTag.commit.id;
}

export async function getCommitsSinceLastTag(
  api: GitlabApi,
  projectId: GitlabProjectId
): Promise<Map<string, string>> {
  const latestTagHash = await getLatestTagHash(api, projectId);

  const { commits } = latestTagHash
    ? await api.Repositories.compare(projectId, latestTagHash, 'HEAD')
    : { commits: await api.Commits.all(projectId) };

  const commitIdsToTitle = new Map<string, string>();
  for (const { id, title } of commits) {
    commitIdsToTitle.set(id, title);
  }

  return commitIdsToTitle;
}

export async function createReleaseTag(
  { Tags, Releases }: GitlabApi,
  reference: string,
  titles: string[],
  version: string,
  projectId: GitlabProjectId
) {
  const message = titles.map((title) => `- ${title}`).join('\n');
  const description = '## Changes\n\n' + message;

  await Tags.create(projectId, version, reference, { message });
  return Releases.create(projectId, {
    name: version,
    tag_name: version,
    description,
  });
}
