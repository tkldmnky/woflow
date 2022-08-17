import fetch from "node-fetch";

/**
 * # Nodes on Nodes Challenge

  ## Nodes API

  An API endpoint returns one or more nodes based on the ID(s) given (comma separated).

  Each node contains two keys:

  - `id` - a UUID unique to the node
  - `child_node_ids` - an array of other node IDs

  Example request using comma separated IDs:

  ```
  GET: https://nodes-on-nodes-challenge.herokuapp.com/nodes/ac0e9fe4-8de0-41e6-9656-b07b40194f47,59013ddb-d691-43c8-8274-7c87e1d739b4
  ```

  ```json
  [
  {
    "id": "ac0e9fe4-8de0-41e6-9656-b07b40194f47",
    "child_node_ids": ["f1f509be-e589-479e-a2d8-04cddbddc154", "9e145221-5a5a-446b-abdd-8092ced6a6cf"]
  },
  {
    "id": "59013ddb-d691-43c8-8274-7c87e1d739b4",
    "child_node_ids": []
  }
  ]
  ```

  Given a single starting node ID `089ef556-dfff-4ff2-9733-654645be56fe`, write an algorithm to traverse the complete node tree in order to answer the 2 following questions:

  1. What is the total number of unique nodes?
  2. Which node ID is shared the most among all other nodes?

  Please respond with any code you wrote to complete this challenge along with the answers to the 2 questions above. You can use any language / libraries you prefer to complete this challenge.
*/


class NodesOnNodes {
  constructor() {
    this.uniqueNodes = new Set();
    this.nodeFrequencies = {};
  }

  async traverseNode(nodeId) {
    // do a pre-order depth-first-traversal
    this.uniqueNodes.add(nodeId); // add to the set

    if (!(nodeId in this.nodeFrequencies)) {
      this.nodeFrequencies[nodeId] = 1;
    } else {
      this.nodeFrequencies[nodeId]++;
    }

    // fetch the node with the given nodeId in order to traverse the children of the current node
    const res = await fetch(`https://nodes-on-nodes-challenge.herokuapp.com/nodes/${nodeId}`);
    const resData = await res.json();
    const data = resData[0];
    const child_node_ids = data.child_node_ids;

    // traverse the children of the node
    for (const childId of child_node_ids) {
      await this.traverseNode(childId);
    }

    return this.uniqueNodes;
  }

  getTotalNumberOfUniqueNodes() {
    return this.uniqueNodes.size;
  }

  getMostFrequentNodeId() {
    // Note that it is possible to have more than 1 id with the highest frequency
    let idWithHighestFrequency = null;
    let knownHighest = 0;

    for (const nodeId in this.nodeFrequencies) {
      const currentFrequency = this.nodeFrequencies[nodeId];

      if (currentFrequency > knownHighest) {
        knownHighest = currentFrequency;
        idWithHighestFrequency = nodeId;
      }
    }

    return idWithHighestFrequency;
  }
}


const testNode = new NodesOnNodes();
testNode.traverseNode('089ef556-dfff-4ff2-9733-654645be56fe');

// 1. What is the total number of unique nodes?
console.log(testNode.getTotalNumberOfUniqueNodes()); //
// 2. Which node ID is shared the most among all other nodes?
console.log(testNode.getMostFrequentNodeId()); //