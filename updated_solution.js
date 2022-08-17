import fetch from "node-fetch";

const uniqueNodes = new Set();
const nodeFrequencies = {};

async function traverseNode(nodeId) {
  // do a pre-order depth-first-traversal
  uniqueNodes.add(nodeId); // add to the set

  if (!(nodeId in nodeFrequencies)) {
    nodeFrequencies[nodeId] = 1;
    // fetch the node with the given nodeId in order to traverse the children of the current node
    const res = await fetch(`https://nodes-on-nodes-challenge.herokuapp.com/nodes/${nodeId}`);
    const data = await res.json();
    const child_node_ids = data[0].child_node_ids;

    // traverse the children of the node
    for (const childId of child_node_ids) {
      await traverseNode(childId);
    }
  } else {
    nodeFrequencies[nodeId]++;
  }
}

function getMostFrequentNodeId() {
  // Note that it is possible to have more than 1 id with the highest frequency
  let idWithHighestFrequency = null;
  let knownHighest = 0;

  for (const nodeId in nodeFrequencies) {
    const currentFrequency = nodeFrequencies[nodeId];

    if (currentFrequency > knownHighest) {
      knownHighest = currentFrequency;
      idWithHighestFrequency = nodeId;
    }
  }

  return idWithHighestFrequency;
}


await (traverseNode('089ef556-dfff-4ff2-9733-654645be56fe'));

// // 1. What is the total number of unique nodes?
console.log(uniqueNodes.size); // 30
// // 2. Which node ID is shared the most among all other nodes?
console.log(getMostFrequentNodeId()); // a06c90bf-e635-4812-992e-f7b1e2408a3f