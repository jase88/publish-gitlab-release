import {
  generateComment,
  getRelatedIssuesForMergeRequest,
  getRelatedMergedMergeRequests,
} from './gitlab-comment';
import { GitlabApi } from './types';

describe('gitlab-comment', () => {
  const gitlabApiMock = {
    Commits: {
      mergeRequests: jest.fn(),
    },
    MergeRequests: {
      closesIssues: jest.fn(),
    },
    IssueNotes: {
      create: jest.fn(),
    },
    MergeRequestDiscussions: {
      create: jest.fn(),
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRelatedMergedMergeRequests', () => {
    it('should return an array of merged merge requests', async () => {
      const projectId = 6;
      const hash = 'test-hash';
      const mergeRequests = [
        { project_id: projectId, iid: 1, state: 'merged' },
        { project_id: projectId, iid: 2, state: 'opened' },
        { project_id: projectId, iid: 3, state: 'merged' },
      ];
      gitlabApiMock.Commits.mergeRequests.mockResolvedValueOnce(mergeRequests);

      const result = await getRelatedMergedMergeRequests(
        gitlabApiMock as unknown as GitlabApi,
        hash,
        projectId
      );

      expect(result).toEqual([
        { project_id: projectId, iid: 1 },
        { project_id: projectId, iid: 3 },
      ]);
      expect(gitlabApiMock.Commits.mergeRequests).toHaveBeenCalledWith(
        projectId,
        hash
      );
    });
  });

  describe('getRelatedIssuesForMergeRequest', () => {
    it('should return an array of related issues for a merge request', async () => {
      const projectId = 5;
      const iid = 1;
      const mergeRequest = { project_id: projectId, iid };
      const issues = [
        { project_id: projectId, iid: 2 },
        { project_id: projectId, iid: 3 },
      ];
      gitlabApiMock.MergeRequests.closesIssues.mockResolvedValueOnce(issues);

      const result = await getRelatedIssuesForMergeRequest(
        gitlabApiMock as unknown as GitlabApi,
        mergeRequest
      );

      expect(result).toEqual(issues);
      expect(gitlabApiMock.MergeRequests.closesIssues).toHaveBeenCalledWith(
        projectId,
        iid
      );
    });
  });

  describe('generateComment', () => {
    it('should generate a comment for a merge request', () => {
      const commentType = 'mergerequest';
      const version = '1.0.0';
      const releaseUrl = 'https://example.com/releases/1.0.0';
      const expectedComment =
        'Your changes are live in version 1.0.0 🚀\n\nYou can check out the release [here](https://example.com/releases/1.0.0) 📦';
      const result = generateComment(commentType, version, releaseUrl);

      expect(result).toEqual(expectedComment);
    });

    it('should generate a comment for an issue', () => {
      const commentType = 'issue';
      const version = '1.0.0';
      const releaseUrl = 'https://example.com/releases/1.0.0';
      const expectedComment =
        'Your issue has been resolved in version 1.0.0 🚀\n\nYou can check out the release [here](https://example.com/releases/1.0.0) 📦';
      const result = generateComment(commentType, version, releaseUrl);
      expect(result).toEqual(expectedComment);
    });
  });
});
