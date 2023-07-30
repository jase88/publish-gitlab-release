import {
  createReleaseTag,
  getCommitsSinceLastTag,
  getLatestTagHash,
} from './git-tags';
import { GitlabApi } from './types';

describe('getLatestTagHash', () => {
  it('returns undefined when no tags are found', async () => {
    const apiMock = {
      Tags: {
        all: jest.fn().mockResolvedValue([]),
      },
    };
    const api = apiMock as unknown as GitlabApi;
    const projectId = 2;

    const result = await getLatestTagHash(api, projectId);

    expect(apiMock.Tags.all).toHaveBeenCalledWith(projectId, {
      perPage: 1,
      page: 1,
    });
    expect(result).toBeUndefined();
  });

  it('returns the latest tag hash when tags are found', async () => {
    const latestTag = {
      name: 'v1.0.0',
      commit: {
        id: 'abc123',
      },
    };
    const apiMock = {
      Tags: {
        all: jest.fn().mockResolvedValue([latestTag]),
      },
    };
    const api = apiMock as unknown as GitlabApi;
    const projectId = 1;

    const result = await getLatestTagHash(api, projectId);

    expect(apiMock.Tags.all).toHaveBeenCalledWith(projectId, {
      perPage: 1,
      page: 1,
    });
    expect(result).toBe(latestTag.commit.id);
  });
});

describe('getCommitsSinceLastTag', () => {
  it('returns a map of commit IDs to titles', async () => {
    const apiMock = {
      Repositories: {
        compare: jest.fn().mockResolvedValue({
          commits: [
            {
              id: 'def456',
              title: 'Commit title 1',
            },
            {
              id: 'ghi789',
              title: 'Commit title 2',
            },
          ],
        }),
      },
      Commits: {
        all: jest.fn().mockResolvedValue([
          {
            id: 'jkl012',
            title: 'Commit title 3',
          },
        ]),
      },
    };
    const api = apiMock as unknown as GitlabApi;
    const projectId = 42;

    const result = await getCommitsSinceLastTag(api, projectId);

    expect(apiMock.Repositories.compare).toHaveBeenCalledWith(
      projectId,
      expect.any(String),
      'HEAD'
    );
    expect(result).toEqual(
      new Map([
        ['def456', 'Commit title 1'],
        ['ghi789', 'Commit title 2'],
        ['jkl012', 'Commit title 3'],
      ])
    );
  });
});

describe('createReleaseTag', () => {
  it('creates a tag and a release', async () => {
    const apiMock = {
      Tags: {
        create: jest.fn().mockReturnValue(Promise.resolve()),
      },
      Releases: {
        create: jest.fn().mockReturnValue(Promise.resolve()),
      },
    };
    const api = apiMock as unknown as GitlabApi;
    const reference = 'abc123';
    const titles = ['Commit title 1', 'Commit title 2'];
    const version = 'v1.0.0';
    const projectId = 9;

    await createReleaseTag(api, reference, titles, version, projectId);

    expect(apiMock.Tags.create).toHaveBeenCalledWith(
      projectId,
      version,
      reference,
      {
        message: '- Commit title 1\n- Commit title 2',
      }
    );
    expect(apiMock.Releases.create).toHaveBeenCalledWith(projectId, {
      name: version,
      tag_name: version,
      description: '## Changes\n\n- Commit title 1\n- Commit title 2',
    });
  });
});
