const defaultCompare = ([a], [b]) => a.localeCompare(b);

class IteratorMap {
  #iterator;
  #mapFn;
  constructor(iterator, mapFn) {
    this.#iterator = iterator;
    this.#mapFn = mapFn;
  }

  [Symbol.iterator]() { return this; }

  next() {
    const result = this.#iterator.next()
    if (!result.done) {
      return { done: false, value: this.#mapFn(result.value) }
    }
    return result;

  }
}
class HeapMapKeys extends IteratorMap {
  constructor(entriesIterator) {
    super(entriesIterator, ([key]) => key);
  }
}

class HeapMapValues extends IteratorMap {
  constructor(entriesIterator) {
    super(entriesIterator, ([_k, value]) => value);
  }
}

const assertValidTuple = (tuple) => {
  if (tuple.length !== 2) {
    throw new TypeError('kvPairs must be an iterable of arrays with length of 2');
  }
}

const assertValidCompare = (compare) => {
  if (typeof compare !== 'function') {
    throw new TypeError('compare must be a function');
  }
}
class HeapMap {
  #data = []
  #indexes = new Map();
  #compare;
  static from(mapLike, compare = mapLike.#compare, mapFn = (i) => i, thisArg = globalThis) {
    const heap = new HeapMap(compare);
    let tupleIndex = 0;
    for (const sourceTuple of mapLike) {
      const finalTuple = mapFn.call(thisArg, sourceTuple, tupleIndex++);
      assertValidTuple(finalTuple);
      heap.set(...finalTuple);
    }

    return heap;
  }

  constructor(compare = defaultCompare, kvPairs = []) {
    assertValidCompare(compare);

    this.#compare = compare;
    for (const tuple of kvPairs) {
      assertValidTuple(tuple);
      this.set(k, v);
    }
  }

  #siftLeafToRoot() {
    let index = this.#data.length - 1;
    let parent;
    while (
      index > 0 &&
      this.#compare(this.#data[parent = Math.floor(index / 2)], this.#data[index]) > 0
    ) {
      this.#indexes.set(this.#data[index][0], parent);
      this.#indexes.set(this.#data[parent][0], index);

      [this.#data[index], this.#data[parent], index] = [this.#data[parent], this.#data[index], parent];
    }
  }
  #siftRootDown() {
    let index = 0
    while (true) {
      const left = index * 2;
      const right = (index * 2) + 1;
      let child;

      if (left >= this.#data.length) {
        break;
      }

      if (right >= this.#data.length || this.#compare(this.#data[left], this.#data[right]) < 0) {
        child = left;
      } else {
        child = right
      }

      if (this.#compare(this.#data[index], this.#data[child]) > 0) {
        this.#indexes.set(this.#data[index][0], child);
        this.#indexes.set(this.#data[child][0], index);

        [this.#data[index], this.#data[child], index] = [this.#data[child], this.#data[index], child];

        continue;
      }

      break;
    }

  }

  #forceSiftToRoot(index) {
    while (index > 0) {
      const parent = Math.floor(index / 2);
      [this.#data[index], this.#data[parent], index] = [this.#data[parent], this.#data[index], parent];
    }
  }
  #forcePlaceLeafAtRoot() {
    const leaf = this.#data.pop();
    this.#indexes.set(leaf[0], 0);
    this.#data[0] = leaf;
  }

  get size() {
    return this.#indexes.size;
  }

  get(key) {
    if (!this.#indexes.has(key)) return undefined;

    const index = this.#indexes.get(key);
    return this.#data[index][1];
  }

  set(key, value) {
    const newTuple = Object.freeze([key, value]);
    this.delete(key);

    this.#data.push(newTuple);
    this.#indexes.set(key, this.#data.length - 1);
    this.#siftLeafToRoot();
  }

  get root() {
    return this.#data[0];
  }

  peek() {
    return this.#data[0];
  }

  pop() {
    if (this.size === 0) return;

    const topTuple = this.peek();
    this.delete(topTuple[0]);
    return topTuple;
  }

  delete(key) {
    if (!this.#indexes.has(key)) return false;
    let index = this.#indexes.get(key);
    this.#indexes.delete(key);

    if (index === this.#data.length - 1) {
      this.#data.pop();
      return true;
    }

    this.#forceSiftToRoot(index);
    this.#forcePlaceLeafAtRoot()
    this.#siftRootDown();

    return true;
  }


  [Symbol.iterator]() {
    return this.#data[Symbol.iterator]();
  }

  entries() {
    const copy = HeapMap.from(this);
    return {
      next: () => {
        const tuple = copy.pop();

        return {
          done: copy.size === 0,
          value: tuple
        }
      }
    }
  }

  values() {
    const entriesIterator = this.entries();
    return new HeapMapValues(entriesIterator);
  }

  keys() {
    const entriesIterator = this.entries();
    return new HeapMapKeys(entriesIterator);
  }
}




export default HeapMap;
