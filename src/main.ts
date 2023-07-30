#! /usr/bin/env node

import {
  generateComment,
  getRelatedIssuesForMergeRequest,
  getRelatedMergedMergeRequests,
  postCommentToIssue,
  postCommentToMergeRequest,
} from './gitlab-comment';
import { createContextFromArguments } from './create-context-from-arguments';
import { unique } from './util';
import { createReleaseTag, getCommitsSinceLastTag } from './git-tags';

const { version, host, projectId, api, reference } =
  createContextFromArguments();

const commits = await getCommitsSinceLastTag(api, projectId);
const commitHashValues = [...commits.keys()];
const titles = [...commits.values()];

const resolvedRelatedMergeRequests = await Promise.all(
  commitHashValues.map((hash) =>
    getRelatedMergedMergeRequests(api, hash, projectId)
  )
);
const relatedMergeRequests = unique(resolvedRelatedMergeRequests.flat(), 'iid');

const resolvedRelatedIssues = await Promise.all(
  relatedMergeRequests.map((mergeRequest) =>
    getRelatedIssuesForMergeRequest(api, mergeRequest)
  )
);
const relatedIssues = unique(resolvedRelatedIssues.flat(), 'iid');

const { tag_path } = await createReleaseTag(
  api,
  reference,
  titles,
  version,
  projectId
);
const releaseUrl = host + tag_path;

const mergeRequestComment = generateComment(
  'mergerequest',
  version,
  releaseUrl
);
const issueComment = generateComment('issue', version, releaseUrl);

await Promise.all([
  ...relatedMergeRequests.map((mergeRequest) =>
    postCommentToMergeRequest(api, mergeRequest, mergeRequestComment)
  ),
  ...relatedIssues.map((issue) => postCommentToIssue(api, issue, issueComment)),
]);
