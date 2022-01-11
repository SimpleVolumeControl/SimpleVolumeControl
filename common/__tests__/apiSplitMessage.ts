import apiSplitMessage from '../apiSplitMessage';

describe('apiSplitMessage', () => {
  test('should split at the message at the first colon', () => {
    const { code, content } = apiSplitMessage('FOOBAR:foo:test 123');
    expect(code).toBe('FOOBAR:');
    expect(content).toBe('foo:test 123');
  });

  test('should be able to handle message without a colon', () => {
    const { code, content } = apiSplitMessage('foobar');
    expect(code).toBe('');
    expect(content).toBe('foobar');
  });
});
