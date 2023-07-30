import { GitlabApi, GitlabProjectId, Issue, MergeRequest } from './types';
export async function getRelatedMergedMergeRequests(
  { Commits }: GitlabApi,
  hash: string,
  projectId: GitlabProjectId
): Promise<MergeRequest[]> {
  const mergeRequests = await Commits.mergeRequests(projectId, hash);
  return mergeRequests
    .filter(({ state }) => state === 'merged')
    .map(({ project_id, iid }) => ({ project_id, iid }));
}

export async function getRelatedIssuesForMergeRequest(
  { MergeRequests }: GitlabApi,
  { project_id, iid }: MergeRequest
): Promise<Issue[]> {
  const mergeRequests = await MergeRequests.closesIssues(project_id, iid);
  return mergeRequests.map(({ project_id, iid }) => ({ project_id, iid }));
}

export function generateComment(
  commentType: 'mergerequest' | 'issue',
  version: string,
  releaseUrl: string
): string {
  return `${
    commentType === 'mergerequest'
      ? 'Your changes are live'
      : 'Your issue has been resolved'
  } in version ${version} 🚀

You can check out the release [here](${releaseUrl}) 📦`;
}

export function postCommentToIssue(
  { IssueNotes }: GitlabApi,
  { project_id, iid }: Issue,
  comment: string
) {
  return IssueNotes.create(project_id, iid, comment);
}

export function postCommentToMergeRequest(
  { MergeRequestDiscussions }: GitlabApi,
  { project_id, iid }: MergeRequest,
  comment: string
) {
  return MergeRequestDiscussions.create(project_id, iid, comment);
}
