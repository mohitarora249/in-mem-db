/**
 * An in-memory database that supports basic CRUD operations,
 * incrementing/decrementing numeric values, and setting TTLs for keys.
 *
 * Note that this implementation is not thread-safe and should not be used
 * in a multi-threaded environment.
 */
export class InMemoryDB {
    private store: Map<string, any>;
    private ttlStore: Map<string, NodeJS.Timeout>;
  
    /**
     * Creates a new instance of the in-memory database.
     */
    constructor() {
      this.store = new Map();
      this.ttlStore = new Map();
    }
  
    /**
     * Sets the value for a given key.
     *
     * If the key already has a TTL, it will be cleared.
     * @param key The key to set.
     * @param value The value to set.
     */
    public set(key: string, value: any): void {
      if (this.ttlStore.has(key)) {
        clearTimeout(this.ttlStore.get(key)!);
        this.ttlStore.delete(key);
      }
      this.store.set(key, value);
    }
  
    /**
     * Gets the value for a given key.
     * @param key The key to get.
     * @returns The value for the key, or null if the key does not exist.
     */
    public get(key: string): any | null {
      if (!this.store.has(key)) {
        return null;
      }
      return this.store.get(key);
    }
  
    /**
     * Deletes a key from the database.
     * @param key The key to delete.
     */
    public del(key: string): void {
      this.store.delete(key);
      if (this.ttlStore.has(key)) {
        clearTimeout(this.ttlStore.get(key)!);
        this.ttlStore.delete(key);
      }
    }
  
    /**
     * Sets a TTL for a given key.
     *
     * If the key already has a TTL, it will be cleared before setting a new one.
     * @param key The key to set a TTL for.
     * @param seconds The number of seconds until the key expires.
     */
    public expire(key: string, seconds: number): void {
      if (!this.store.has(key)) {
        return;
      }
  
      // If key already has a TTL, clear it before setting a new one
      if (this.ttlStore.has(key)) {
        clearTimeout(this.ttlStore.get(key)!);
      }
  
      const ttlTimeout = setTimeout(() => {
        this.del(key); // Automatically delete the key when TTL expires
      }, seconds * 1000);
  
      // Store the TTL timer reference
      this.ttlStore.set(key, ttlTimeout);
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
      this.ttlStore.forEach((timeout) => clearTimeout(timeout));
      this.ttlStore.clear();
    }
  }
  