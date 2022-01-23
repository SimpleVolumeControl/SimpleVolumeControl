class Queue<T> {
  private readonly interval: number;
  private handlers: ((value: T) => void)[] = [];
  private timeoutId: NodeJS.Timeout | null = null;
  private queue: T[] = [];

  constructor(interval: number) {
    if (interval <= 0) {
      throw new Error('interval out of range');
    }
    this.interval = interval;
  }

  public addHandler(func: (value: T) => void) {
    this.handlers.push(func);
  }

  public queueValue(value: T) {
    this.queue.push(value);
    if (this.timeoutId === null) {
      this.fire();
    }
  }

  private fire() {
    const value = this.queue.shift();
    if (value === undefined) {
      this.timeoutId = null;
    } else {
      this.handlers.forEach((handler) => {
        handler(value);
      });
      this.timeoutId = setTimeout(() => this.fire(), this.interval);
      this.timeoutId.unref();
    }
  }
}

export default Queue;
