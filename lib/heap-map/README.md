# heap-map

Implementation of a KV heap data structure with the following  runtime characteristics

| Operation | Runtime | Space |
|-----------|---------|-------|
| heapify kv list (via `constructor`) | `O(NlogN)` | `O(N)` (new HeapMap) |
| set(key, value) | `O(logN)` | - |
| get(key) [arbitrary read of key] | `O(1)` | - |
| peek() [top of heap] | `O(1)` | - |
| pop() [top of heap] | `O(logN)` | - |
| delete(key) [arbitrary deletion] | `O(logN)` | - |

## Use cases

As a heap, this data structure can be used to access to min or max of a stream of values in constant time. The map qualities of this structure make it useful in dealing with heap nodes that change value and need to sift up or down in the tree depending on their new value.

### Leet code problems that can be solved using this structure

#### [Design a leader board](https://leetcode.com/problems/design-a-leaderboard/description/)

This problem requires us to get the sum of the top K scores while supporting arbitrary updates to the scores of each player.

##### Solution 
<details>
<summary>See Solution</summary>

```js

var Leaderboard = function() {
    this.scores = new HeapMap(([_, scoreA], [_2, scoreB]) => scoreB - scoreA)
};

Leaderboard.prototype.addScore = function(playerId, score) {
    const currentScore = this.scores.get(playerId) || 0;
    this.scores.set(playerId, currentScore + score)
};

Leaderboard.prototype.top = function(K) {
    let sum = 0;
    
    for (let i = 0; i < K; i++) {
        const score = this.scores.pop()[1]
        sum += score;
    }

    
    for (const [player, score] of top) {
        this.scores.set(player, score)
    }

    return sum;
};

Leaderboard.prototype.reset = function(playerId) {
    this.scores.delete(playerId)
};
```

##### Runtime

| method | time | space |
| `addScore(_, _)` | `O(logN)` | - |
| `reset(_)` | `O(logN)` | - |
| `top(K)` | `O(KlogN)` | - |

</details>

