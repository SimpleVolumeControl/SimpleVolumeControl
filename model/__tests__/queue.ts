import Queue from '../queue';

describe('Queue', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test('should fire immediately on first value', () => {
    const queue = new Queue<string>(1000);
    const mockFn = jest.fn();
    queue.addHandler(mockFn);
    queue.queueValue('foobar');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('foobar');
  });

  test('should fire delayed on second value', () => {
    jest.useFakeTimers();
    const queue = new Queue<string>(1000);
    const mockFn = jest.fn();
    queue.addHandler(mockFn);
    queue.queueValue('1');
    queue.queueValue('2');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('1');
    jest.advanceTimersByTime(950);
    expect(mockFn).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('2');
  });

  test('should fire immediately on second value if provided after timer elapsed', () => {
    jest.useFakeTimers();
    const queue = new Queue<string>(1000);
    const mockFn = jest.fn();
    queue.addHandler(mockFn);
    queue.queueValue('1');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('1');
    jest.advanceTimersByTime(1200);
    queue.queueValue('2');
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('2');
  });

  test('should throw if invalid interval is supplied', () => {
    expect(() => new Queue(-1)).toThrowError();
    expect(() => new Queue(0)).toThrowError();
  });
});
