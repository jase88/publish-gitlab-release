import { createContextFromArguments } from "./create-context-from-arguments";
// jest.mock('node:util', () => ({
//   parseArgs: jest.fn(() => ({
//     values: {
//       version: '1.0.0',
//       host: 'gitlab.example.com',
//       token: 'abc123',
//       project: '123',
//       ref: 'abcdefg',
//     },
//   })),
// }));

describe('createContextFromArguments', () => {
  beforeEach(() => {
    process.env.CI_PROJECT_ID = '456';
    process.env.CI_SERVER_PROTOCOL = 'https';
    process.env.CI_SERVER_HOST = 'gitlab.com';
    process.env.CI_SERVER_PORT = '8080';
    process.env.GITLAB_PROJECT_TOKEN = 'xyz789';
    process.env.CI_COMMIT_SHA = '1234567890abcdef';
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should throw an error if no valid version is found', () => {
    jest.mock('node:util', () => ({
      parseArgs: jest.fn(() => ({
        values: {
          host: 'gitlab.example.com',
          token: 'abc123',
          project: '123',
          ref: 'abcdefg',
          version: ''
        },
      })),
    }));

    expect(() => createContextFromArguments()).toThrowError('No valid version found');
  });

  it('should throw an error if no valid token is found', () => {
    jest.mock('node:util', () => ({
      parseArgs: jest.fn(() => ({
        values: {
          version: '1.0.0',
          host: 'gitlab.example.com',
          project: '123',
          ref: 'abcdefg',
        },
      })),
    }));

    expect(() => createContextFromArguments()).toThrowError('No valid token found');
  });

  it('should throw an error if no valid project iid is found', () => {
    jest.mock('node:util', () => ({
      parseArgs: jest.fn(() => ({
        values: {
          version: '1.0.0',
          host: 'gitlab.example.com',
          token: 'abc123',
          ref: 'abcdefg',
        },
      })),
    }));

    expect(() => createContextFromArguments()).toThrowError('No valid project iid found');
  });

  it('should throw an error if no valid git ref is given', () => {
    jest.mock('node:util', () => ({
      parseArgs: jest.fn(() => ({
        values: {
          version: '1.0.0',
          host: 'gitlab.example.com',
          token: 'abc123',
          project: '123',
        },
      })),
    }));

    expect(() => createContextFromArguments()).toThrowError('No valid git ref given for which hash a release should be created');
  });

  it('should create a context with the correct values', () => {
    const context = createContextFromArguments();

    expect(context.api).toBeDefined();
    expect(context.host).toBe('gitlab.example.com');
    expect(context.projectId).toBe(123);
    expect(context.version).toBe('1.0.0');
    expect(context.reference).toBe('abcdefg');
  });
});
