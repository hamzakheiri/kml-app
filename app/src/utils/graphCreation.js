export class WeightedGraph {
 constructor() {
    this.adjacencyList = new Map();
    this.source = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(vertex1, vertex2, weight, source) {
    if (!this.adjacencyList.has(vertex1) || !this.adjacencyList.has(vertex2)) {
      throw new Error('Vertex does not exist.');
    }

    const check = this.adjacencyList.get(vertex1).find(e => e.node === vertex2);
    if (!check){
      this.adjacencyList.get(vertex1).push({ node: vertex2, weight: weight });
      this.adjacencyList.get(vertex2).push({ node: vertex1, weight: weight });
      this.source.set([vertex1, vertex2].sort().join(), source);
      
    } else if (weight < check.weight) {
      const i1 = this.adjacencylist.get(vertex1).findIndex(e => e.node === vertex2); 
      const i2 = this.adjacencyList.get(vertex2).findIndex(e => e.node === vertex1);
      
      this.adjacencylist.get(vertex1)[i1] = { node: vertex2, weight: weight };
      this.adjacencylist.get(vertex2)[i2] = { node: vertex1, weight: weight };
      this.source.set([vertex1, vertex2].sort().join(), source);
   }
  }

  display() {
    for (let [vertex, edges] of this.adjacencyList.entries()) {
      console.log(vertex, "->", edges);
    }
  }

  clear() {
    this.adjacencyList.clear();
    this.source.clear();
  }

  dijkstra(start, end) {
    const distances = new Map();
    const previous = new Map();
    const pq = new PriorityQueue();
    const visited = new Set();
    const path = [];
    let smallest;

    // Initial state
    for (let vertex of this.adjacencyList.keys()) {
      if (vertex === start) {
        distances.set(vertex, 0);
        pq.enqueue(vertex, 0);
      } else {
        distances.set(vertex, Infinity);
        pq.enqueue(vertex, Infinity);
      }
      previous.set(vertex, null);
    }

    while (pq.values.length) {
      smallest = pq.dequeue().val;

      if (smallest === end) {
        // Build path
        while (previous.get(smallest)) {
          path.push(smallest);
          smallest = previous.get(smallest);
        }
        break;
      }

      if (!visited.has(smallest) && distances.get(smallest) !== Infinity) {
        visited.add(smallest);
        for (let neighbor of this.adjacencyList.get(smallest)) {
          let candidate = distances.get(smallest) + neighbor.weight;

          if (candidate < distances.get(neighbor.node)) {
            distances.set(neighbor.node, candidate);
            previous.set(neighbor.node, smallest);
            pq.enqueue(neighbor.node, candidate);
          }
        }
      }
    }

    return path.concat(smallest).reverse();
  }
}

class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }
}

