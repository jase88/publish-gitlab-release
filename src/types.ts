import { Gitlab } from '@gitbeaker/node';

export type GitlabApi = InstanceType<typeof Gitlab<false>>;
export type GitlabProjectId = number;

export interface Context {
  api: GitlabApi;
  host: string;
  projectId: GitlabProjectId;
  version: string;
  reference: string;
}

export interface MergeRequest {
  project_id: number;
  iid: number;
}

export interface Issue {
  project_id: number;
  iid: number;
}
