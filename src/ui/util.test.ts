import { PageLoadStatus, pageLoadStatusString } from './util';

describe('pageLoadStatusString', () => {
  test('Should return a string representation of a PageLoadStatus set', () => {
    let testStatus = PageLoadStatus.Ready;
    expect(pageLoadStatusString(testStatus)).toBe('Ready');

    testStatus = PageLoadStatus.ValidEmptyDataSet;
    expect(pageLoadStatusString(testStatus)).toBe('ValidEmptyDataSet');
  })
});
