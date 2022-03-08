/**
 * A FIFO queue that triggers an action for every element.
 * It guarantees a minimum time between two firings.
 */
class Queue<T> {
  /**
   * The guaranteed minimum time between two firings.
   */
  private readonly interval: number;

  /**
   * A list of callbacks that are called for every element,
   * always respecting the minimum time interval between different elements.
   */
  private handlers: ((value: T) => void)[] = [];

  /**
   * The handle for the timeout which ensures the time interval.
   */
  private timeoutId: NodeJS.Timeout | null = null;

  /**
   * The list of queued elements.
   */
  private queue: T[] = [];

  /**
   * Create a new queue with a fixed interval.
   *
   * @param interval The minimum time (in ms) between two elements.
   */
  constructor(interval: number) {
    if (interval <= 0) {
      throw new Error('interval out of range');
    }
    this.interval = interval;
  }

  /**
   * Add a callback function that is called for every element.
   *
   * @param func The callback function to be added.
   */
  public addHandler(func: (value: T) => void) {
    this.handlers.push(func);
  }

  /**
   * Queue a new value.
   * If possible without violating the guaranteed interval, the callbacks will be triggered immediately,
   * otherwise the triggering is delayed to the next possible occasion.
   *
   * @param value The value to be queued.
   */
  public queueValue(value: T) {
    this.queue.push(value);
    // When there is currently no timeout handle,
    // it means that the interval has already elapsed since the last firing.
    if (this.timeoutId === null) {
      this.fire();
    }
  }

  /**
   * Trigger the callbacks for the next value in the queue.
   */
  private fire() {
    // Fetch the next value.
    const value = this.queue.shift();

    if (value === undefined) {
      // If there is no value, remove the timeout handle to indicate the idling state.
      this.timeoutId = null;
    } else {
      // Otherwise, call the callbacks and start a new timeout for the next firing.
      this.handlers.forEach((handler) => {
        handler(value);
      });
      this.timeoutId = setTimeout(() => this.fire(), this.interval);
      this.timeoutId.unref();
    }
  }
}

export default Queue;
