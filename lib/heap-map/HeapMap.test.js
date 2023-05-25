import HeapMap from './HeapMap';
const minValueCompare = ([kA, vA], [kB, vB]) => vA - vB
const inRandomOrder = function* (iter) {
  const copy = [...iter];
  while (copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length);
    const value = copy[index];
    copy.splice(index, 1)
    yield value
  }
}

const alphabetTuples = function* () {
  for (let i = 0; i < 26; i++) {
    const char = String.fromCharCode('a'.charCodeAt(0) + i);

    yield [char, i]
  }
}

describe('HeapMap', () => {
  describe('#pop', () => {
    it('behaves as expected', () => {
      const heap = new HeapMap();

      heap.set('c', 1);
      heap.set('z', 2);
      heap.set('b', 3);
      heap.set('a', 4);
      heap.set('e', 5);
      heap.set('x', 6);
      expect(heap.pop()).toEqual(['a', 4])
      expect(heap.pop()).toEqual(['b', 3])
      expect(heap.pop()).toEqual(['c', 1])
      expect(heap.pop()).toEqual(['e', 5])
      expect(heap.pop()).toEqual(['x', 6])
      expect(heap.pop()).toEqual(['z', 2])
      expect(heap.size).toBe(0)
    })
  })

  describe('#get', () => {
    it('gets the value', () => {
      const heap = new HeapMap();

      heap.set('a', 1)
      heap.set('b', 2)
      heap.set('c', 3)

      expect(heap.get('a')).toBe(1)
      expect(heap.get('b')).toBe(2)
      expect(heap.get('c')).toBe(3)
      expect(heap.size).toBe(3)

      heap.set('a', 4)
      expect(heap.get('a')).toBe(4)
      expect(heap.get('b')).toBe(2)
      expect(heap.get('c')).toBe(3)
      expect(heap.size).toBe(3)

      heap.delete('a');
      expect(heap.size).toBe(2)
      expect(heap.get('a')).toBe(undefined)
    });
  });

  describe('#set', () => {
    it('updates the value and heap structure', () => {
      const heap = new HeapMap(minValueCompare);

      heap.set('a', 10)
      heap.set('b', 9)
      heap.set('c', 8)
      heap.set('d', 7)
      heap.set('e', 6)

      expect(heap.peek()).toEqual(['e', 6])

      heap.set('e', 10)

      expect(heap.peek()).toEqual(['d', 7])
      expect(heap.pop()).toEqual(['d', 7])

      heap.set('c', 10)

      expect(heap.peek()).toEqual(['b', 9])

      heap.set('c', 1)

      expect(heap.peek()).toEqual(['c', 1])

      heap.set('c', 10)

      expect(heap.peek()).toEqual(['b', 9])
    })
  })

  describe('#delete', () => {
    it('changes priorities when it is top node', () => {
      const heap = new HeapMap(minValueCompare);

      for (const [k, v] of inRandomOrder(alphabetTuples())) {
        heap.set(k, v);
      }

      expect(heap.peek()).toEqual(['a', 0])
      expect(heap.size).toBe(26)

      expect(heap.delete('a')).toBe(true);

      expect(heap.size).toBe(25)
      expect(heap.peek()).toEqual(['b', 1])
    });

    it('deletes key without affecting priority of top keys', () => {
      const heap = new HeapMap(minValueCompare);

      for (const [k, v] of inRandomOrder(alphabetTuples())) {
        heap.set(k, v)
      }

      expect(heap.peek()).toEqual(['a', 0])
      expect(heap.size).toBe(26)

      expect(heap.delete('f')).toBe(true);

      expect(heap.size).toBe(25)
      expect(heap.pop()).toEqual(['a', 0])
      expect(heap.pop()).toEqual(['b', 1])
      expect(heap.pop()).toEqual(['c', 2])
      expect(heap.pop()).toEqual(['d', 3])
      expect(heap.pop()).toEqual(['e', 4])
      // Here it goes
      expect(heap.pop()).toEqual(['g', 6])
      expect(heap.pop()).toEqual(['h', 7])
      expect(heap.pop()).toEqual(['i', 8])
      expect(heap.pop()).toEqual(['j', 9])
      expect(heap.pop()).toEqual(['k', 10])
      expect(heap.pop()).toEqual(['l', 11])
      expect(heap.pop()).toEqual(['m', 12])
      expect(heap.pop()).toEqual(['n', 13])
      expect(heap.pop()).toEqual(['o', 14])
      expect(heap.pop()).toEqual(['p', 15])
      expect(heap.pop()).toEqual(['q', 16])
      expect(heap.pop()).toEqual(['r', 17])
      expect(heap.pop()).toEqual(['s', 18])
      expect(heap.pop()).toEqual(['t', 19])
      expect(heap.pop()).toEqual(['u', 20])
      expect(heap.pop()).toEqual(['v', 21])
      expect(heap.pop()).toEqual(['w', 22])
      expect(heap.pop()).toEqual(['x', 23])
      expect(heap.pop()).toEqual(['y', 24])
      expect(heap.pop()).toEqual(['z', 25])
      expect(heap.pop()).toBe(undefined)
      expect(heap.size).toBe(0)
    })

    it('returns false when key does not exist', () => {
      const heap = new HeapMap(minValueCompare)

      for (const [k, v] of inRandomOrder(alphabetTuples())) {
        heap.set(k, v)
      }

      expect(heap.delete('az')).toBe(false)
    })
  })

  describe('#[Symbol.iterator]', () => {
    it('allows iterating in non-sorted order but the heapified order', () => {
      const heap = new HeapMap(minValueCompare);

      for (const [k, v] of inRandomOrder(alphabetTuples())) {
        heap.set(k, v);
      }

      const arr = Array.from(heap);

      expect.assertions(26)
      for (let i = 1; i < arr.length; i++) {
        const parent = Math.floor(i / 2);

        expect(arr[i][1]).toBeGreaterThan(arr[parent][1])
      }

      const sorted = [...arr].sort(minValueCompare);
      const areAllSame = sorted.every((v, i) => {
        return v === arr[i]
      })

      expect(areAllSame).toBe(false)
    })
  })

  describe('#entries', () => {
    it('allows iterating over sorted entries', () => {
      const heap = new HeapMap(minValueCompare);

      for (const [k, v] of inRandomOrder(alphabetTuples())) {
        heap.set(k, v);
      }

      const arr = Array.from(heap.entries());

      const sorted = [...arr].sort(minValueCompare);
      const areAllSame = sorted.every((v, i) => {
        return v === arr[i]
      })

      expect(areAllSame).toBe(true)
    })

    it('has no side effects', () => {
      const heap = new HeapMap(minValueCompare);

      for (const [k, v] of inRandomOrder(alphabetTuples())) {
        heap.set(k, v);
      }

      Array.from(heap.entries());
      expect(heap.size).toBe(26)
    })
  })

  describe('#values', () => {
    it('allows iterating over sorted entries', () => {
      const heap = new HeapMap(minValueCompare);

      for (const [k, v] of inRandomOrder(alphabetTuples())) {
        heap.set(k, v);
      }

      const arr = Array.from(heap.values());

      const sorted = [...arr].sort((a, b) => a - b);
      const areAllSame = sorted.every((v, i) => {
        return v === arr[i]
      })

      expect(areAllSame).toBe(true)
    })

    it('has no side effects', () => {
      const heap = new HeapMap(minValueCompare);

      for (const [k, v] of inRandomOrder(alphabetTuples())) {
        heap.set(k, v);
      }

      Array.from(heap.values());
      expect(heap.size).toBe(26)
    })
  })

  describe('#keys', () => {
    it('allows iterating over sorted entries', () => {
      const heap = new HeapMap(minValueCompare);

      for (const [k, v] of inRandomOrder(alphabetTuples())) {
        heap.set(k, v);
      }

      const arr = Array.from(heap.keys());

      const sorted = [...arr].sort((a, b) => heap.get(a) - heap.get(b));
      const areAllSame = sorted.every((v, i) => {
        return v === arr[i]
      })

      expect(areAllSame).toBe(true)
    })

    it('has no side effects', () => {
      const heap = new HeapMap(minValueCompare);

      for (const [k, v] of inRandomOrder(alphabetTuples())) {
        heap.set(k, v);
      }

      Array.from(heap.keys());
      expect(heap.size).toBe(26)
    })
  })
})