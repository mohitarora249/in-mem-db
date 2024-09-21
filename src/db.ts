import { MinHeap } from "./minheap";

/**
 * An in-memory database that supports basic CRUD operations,
 * incrementing/decrementing numeric values, and setting TTLs for keys.
 *
 * Note that this implementation is not thread-safe and should not be used
 * in a multi-threaded environment.
 */
export class InMemoryDB {
  /**
   * The internal store of the database.
   * Each key is associated with a value.
   */
  private store: Map<string, any>;

  /**
   * The internal store of the database that keeps track of the TTLs.
   * Each key is associated with a timestamp representing when the key should expire.
   */
  private ttlStore: MinHeap;

  /**
   * The interval ID for the garbage collector.
   * This interval is used to periodically check for expired keys and remove them.
   */
  private garbageCollectorIntervalId: NodeJS.Timeout;

  /**
   * Creates a new instance of the in-memory database.
   */
  constructor() {
    this.store = new Map();
    this.ttlStore = new MinHeap();
    this.garbageCollectorIntervalId = setInterval(this.collectExpiredKeys.bind(this), 1000);
  }

  /**
   * Sets the value for a given key.
   *
   * If the key already has a TTL, it will be cleared.
   * @param key The key to set.
   * @param value The value to set.
   */
  public set(key: string, value: any): void {
    this.store.set(key, value);
  }

  /**
   * Gets the value for a given key.
   * @param key The key to get.
   * @returns The value for the key, or null if the key does not exist.
   */
  public get(key: string): any | null {
    this.collectExpiredKeys();
    return this.store.get(key) || null;
  }

  /**
   * Deletes a key from the database.
   * @param key The key to delete.
   */
  public del(key: string): void {
    this.store.delete(key);
  }

  /**
   * Sets a TTL for a given key.
   *
   * If the key already has a TTL, it will be cleared before setting a new one.
   * @param key The key to set a TTL for.
   * @param seconds The number of seconds until the key expires.
   */
  public expire(key: string, seconds: number): void {
    const expirationTime = Date.now() + seconds * 1000;
    this.ttlStore.insert(key, expirationTime);
  }

  /**
   * Increments a numeric value for a given key.
   *
   * If the key does not exist, it will be created with a value of 1.
   * @param key The key to increment.
   * @returns The new value for the key, or null if the value is not a number.
   */
  public incr(key: string): number | null {
    if (!this.store.has(key)) {
      this.store.set(key, 1);
      return 1;
    }

    const value = this.store.get(key);

    if (typeof value !== 'number') {
      throw new Error(`Value for key "${key}" is not an integer`);
    }

    const newValue = value + 1;
    this.store.set(key, newValue);
    return newValue;
  }

  /**
   * Decrements a numeric value for a given key.
   *
   * If the key does not exist, it will be created with a value of -1.
   * @param key The key to decrement.
   * @returns The new value for the key, or null if the value is not a number.
   */
  public decr(key: string): number | null {
    if (!this.store.has(key)) {
      this.store.set(key, -1);
      return -1;
    }

    const value = this.store.get(key);

    if (typeof value !== 'number') {
      throw new Error(`Value for key "${key}" is not an integer`);
    }

    const newValue = value - 1;
    this.store.set(key, newValue);
    return newValue;
  }

  /**
   * Checks if a key exists in the database.
   * @param key The key to check.
   * @returns True if the key exists, false otherwise.
   */
  public exists(key: string): boolean {
    return this.store.has(key);
  }

  /**
   * Clears all keys from the database.
   */
  public flushAll(): void {
    this.store.clear();
    this.ttlStore.clear();
    clearInterval(this.garbageCollectorIntervalId);
  }

  /**
   * Collects expired keys and removes them from the database.
   */
  private collectExpiredKeys() {
    const now = Date.now();

    while (this.ttlStore.peek() && this.ttlStore.peek()!.val <= now) {
      const expiringKey = this.ttlStore.extractMin();
      if (expiringKey) {
        this.del(expiringKey.key);
      }
    }
  }
}
