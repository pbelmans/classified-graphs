import cytoscape, {
  EdgeCollection,
  Collection,
  CollectionReturnValue,
} from 'cytoscape';

// Grith of a graph
//
// Definition:
// The girth of an undirected graph is the length of a shortest cycle contained in the graph.
//
// Algorithm:
// 1. Compute a spanning tree.
// 2. The complement of the spanning tree is the set of back-edges.
//    Each back-edge is on a cycle (“closing it”).
// 3. For each back-edge: remove it from the graph and find the shortest distance
//    between its endpoints.
//    Use floydWarshall() method.
//    We can avoid removing the edge by assigning it an infinite weight.
// 4. The cycle length is this distance + 1
// 5. Find the min cycle length

function girth(collection: Collection): CollectionReturnValue {
  const spanningTree = collection.kruskal(() => 1);
  const backEdges = spanningTree.absoluteComplement().edges();
  const fWWeight = (e: EdgeCollection): number =>
    backEdges.anySame(e) ? Number.POSITIVE_INFINITY : 1;
  const fW = collection.floydWarshall({ weight: fWWeight });

  const cycles = backEdges.map((e) => fW.path(e.source(), e.target()).union(e));

  const noCycle = {
    cycle: cytoscape().collection(),
    length: Number.POSITIVE_INFINITY,
  };
  const minCycle = cycles
    .map((cycle) => ({ cycle, length: cycle.size() }))
    .reduce(
      (acc, cycle) => (acc.length < cycle.length ? acc : cycle),
      noCycle,
    ).cycle;

  return minCycle;
}

export default girth;
