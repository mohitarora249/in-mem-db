# In-Memory Database

An in-memory database that supports basic CRUD operations, incrementing/decrementing numeric values, and setting TTLs for keys.

Note that this implementation is not thread-safe and should not be used in a multi-threaded environment.

## Methods

### `set(key: string, value: any): void`

Sets the value for a given key.

If the key already has a TTL, it will be cleared.

**Parameters**

- `key` (string): The key to set.
- `value` (any): The value to set.

### `get(key: string): any | null`

Gets the value for a given key.

**Parameters**

- `key` (string): The key to get.

**Returns**

- (any | null): The value for the key, or null if the key does not exist.

### `del(key: string): void`

Deletes a key from the database.

**Parameters**

- `key` (string): The key to delete.

### `expire(key: string, seconds: number): void`

Sets a TTL for a given key.

If the key already has a TTL, it will be cleared before setting a new one.

**Parameters**

- `key` (string): The key to set a TTL for.
- `seconds` (number): The number of seconds until the key expires.

### `incr(key: string): number | null`

Increments a numeric value for a given key.

If the key does not exist, it will be created with a value of 1.

**Parameters**

- `key` (string): The key to increment.

**Returns**

- (number | null): The new value for the key, or null if the value is not a number.

### `decr(key: string): number | null`

Decrements a numeric value for a given key.

If the key does not exist, it will be created with a value of -1.

**Parameters**

- `key` (string): The key to decrement.

**Returns**

- (number | null): The new value for the key, or null if the value is not a number.

### `exists(key: string): boolean`

Checks if a key exists in the database.

**Parameters**

- `key` (string): The key to check.

**Returns**

- (boolean): True if the key exists, false otherwise.

### `flushAll(): void`

Clears all keys from the database.
