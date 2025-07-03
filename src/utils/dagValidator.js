export function validateDag(nodes, edges) {
  if (nodes.length < 2) {
    return { isValid: false, message: 'Pipeline needs at least 2 nodes' };
  }

  if (edges.length === 0) {
    return { isValid: false, message: 'Pipeline needs at least 1 connection' };
  }

  // Checking for disconnected nodes
  const connectedNodeIds = new Set();
  edges.forEach(edge => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  const disconnectedNodes = nodes.filter(node => !connectedNodeIds.has(node.id));
  if (disconnectedNodes.length > 0) {
    const names = disconnectedNodes.map(n => n.data.label).join(', ');
    return { isValid: false, message: `Disconnected nodes: ${names}` };
  }

  // Checking for cycles using depth-first search
  if (edges.length > 0 && hasCycle(nodes, edges)) {
    return { isValid: false, message: 'Pipeline contains cycles' };
  }

  return { isValid: true, message: 'Pipeline is valid' };
}

function hasCycle(nodes, edges) {
  const visited = new Set();
  const recursionStack = new Set();
  const adjacencyList = createAdjacencyList(nodes, edges);

  for (const nodeId of adjacencyList.keys()) {
    if (detectCycle(nodeId, visited, recursionStack, adjacencyList)) {
      return true;
    }
  }

  return false;
}

function detectCycle(nodeId, visited, recursionStack, adjacencyList) {
  if (recursionStack.has(nodeId)) return true;
  if (visited.has(nodeId)) return false;

  visited.add(nodeId);
  recursionStack.add(nodeId);

  const neighbors = adjacencyList.get(nodeId) || [];
  for (const neighbor of neighbors) {
    if (detectCycle(neighbor, visited, recursionStack, adjacencyList)) {
      return true;
    }
  }

  recursionStack.delete(nodeId);
  return false;
}

function createAdjacencyList(nodes, edges) {
  const adjacencyList = new Map();
  
  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
  });

  edges.forEach(edge => {
    if (adjacencyList.has(edge.source) && adjacencyList.has(edge.target)) {
      adjacencyList.get(edge.source).push(edge.target);
    }
  });

  return adjacencyList;
}