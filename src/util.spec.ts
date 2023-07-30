import { unique } from './util';

describe('unique', () => {
  it('returns an array with unique elements based on an id property', () => {
    const input = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 1, name: 'John' },
      { id: 3, name: 'Adam' },
      { id: 2, name: 'Jenny' },
    ];
    const expectedOutput = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Adam' },
    ];
    const actualOutput = unique(input, 'id');
    expect(actualOutput).toEqual(expectedOutput);
  });
});
