/**
 * A min heap data structure, implemented as an array.
 *
 * The heap property is that the parent node is always less than or equal to its children.
 */
export class MinHeap {
    /**
     * The underlying array of the heap.
     */
    private heap: Array<{ key: string, val: number }>;
  
    /**
     * A map of key to position in the heap.
     * This is used to quickly find the position of a key in the heap.
     */
    private positions: Map<string, number>;
  
    /**
     * Creates a new empty min heap.
     */
    constructor() {
      this.heap = [];
      this.positions = new Map();
    }
  
    /**
     * Checks if the heap is empty.
     * @returns {boolean} True if the heap is empty, false otherwise.
     */
    isEmpty() {
      return this.heap.length === 0;
    }
  
    /**
     * Returns the minimum key-value pair in the heap without removing it.
     * @returns {null|{key: string, val: number}} The minimum key-value pair, or null if the heap is empty.
     */
    peek(): { key: string, val: number } | null {
      return this.isEmpty() ? null : this.heap[0];
    }
  
    /**
     * Clears the heap, removing all key-value pairs.
     */
    clear() {
      this.heap = [];
      this.positions.clear();
      this.positions = new Map();
    }
  
    /**
     * Inserts a new key-value pair into the heap.
     * If the key already exists, its value is updated.
     * @param {string} key The key to insert.
     * @param {number} val The value to insert.
     */
    insert(key: string, val: number) {
      if (this.positions.has(key)) {
        this.update(key, val);
      } else {
        this.heap.push({ key, val });
        this.positions.set(key, this.heap.length - 1);
        this.bubbleUp(this.heap.length - 1);
      }
    }
  
    /**
     * Extracts the minimum key-value pair from the heap.
     * @returns {null|{key: string, val: number}} The minimum key-value pair, or null if the heap is empty.
     */
    extractMin() {
      if (this.isEmpty()) return null;
      const min = this.heap[0];
      const end = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = end!;
        this.positions.set(end!.key, 0);
        this.bubbleDown(0);
      }
      this.positions.delete(min.key);
      return min;
    }
  
    /**
     * Calculates the index of the parent of a given node.
     * @param {number} index The index of the node.
     * @returns {number} The index of the parent node.
     */
    private parentIndex(index: number): number {
      return Math.floor((index - 1) / 2);
    }
  
    /**
     * Calculates the index of the left child of a given node.
     * @param {number} index The index of the node.
     * @returns {number} The index of the left child node.
     */
    private leftChildIndex(index: number): number {
      return 2 * index + 1;
    }
  
    /**
     * Calculates the index of the right child of a given node.
     * @param {number} index The index of the node.
     * @returns {number} The index of the right child node.
     */
    private rightChildIndex(index: number): number {
      return 2 * index + 2;
    }
  
    /**
     * Updates the value of a node in the heap.
     * This method is called by the insert method when a key already exists.
     * @param {string} currentVal The current value of the node.
     * @param {number} newVal The new value of the node.
     */
    private update(currentVal: string, newVal: number) {
      const currentIdx = this.positions.get(currentVal)!;
      const currentValue = this.heap[currentIdx].val;
      this.heap[currentIdx].val = newVal;
      if (currentValue < newVal) {
        this.bubbleDown(currentIdx);
      } else {
        this.bubbleUp(currentIdx);
      }
    }
  
    /**
     * Bubbles up a node in the heap until the heap property is restored.
     * @param {number} index The index of the node to bubble up.
     */
    private bubbleUp(index: number) {
      while (index > 0) {
        const parentIdx = this.parentIndex(index);
        if (this.heap[parentIdx].val <= this.heap[index].val) break;
        [this.heap[parentIdx], this.heap[index]] = [this.heap[index], this.heap[parentIdx]];
        this.positions.set(this.heap[parentIdx].key, parentIdx);
        this.positions.set(this.heap[index].key, index);
        index = parentIdx;
      }
    }
  
    /**
     * Bubbles down a node in the heap until the heap property is restored.
     * @param {number} index The index of the node to bubble down.
     */
    private bubbleDown(index: number) {
      const length = this.heap.length;
      while (true) {
        const leftIdx = this.leftChildIndex(index);
        const rightIdx = this.rightChildIndex(index);
        let smallest = index;
        if (leftIdx < length && this.heap[leftIdx].val < this.heap[smallest].val) {
          smallest = leftIdx;
        } else if (rightIdx < length && this.heap[rightIdx].val < this.heap[smallest].val) {
          smallest = rightIdx;
        }
        if (smallest === index) break;
        [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
        this.positions.set(this.heap[smallest].key, smallest);
        this.positions.set(this.heap[index].key, index);
        index = smallest;
      }
    }
  }
  