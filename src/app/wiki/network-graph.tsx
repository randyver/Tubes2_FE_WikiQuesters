"use client";

import { path } from "d3";
import { useState, useEffect } from "react";
import React from "react";
import Graph from "react-vis-ts";

type MapItem = {
  [key: string]: string[];
};

type stringToIntMap = {
  [key: string]: number;
};

let PathCount : number = 0;

interface WikiResponse {
  query: {
    normalized: { from: string; to: string }[];
    pages: {
      [pageId: string]: {
        pageid: number;
        ns: number;
        title: string;
        thumbnail?: { source: string; width: number; height: number };
        pageimage?: string;
      };
    };
  };
}

function getImageUrlFromResponse(data: WikiResponse): string {
  // Check if the response has pages data
  let imageUrl: string;
  for (const pageId in data.query.pages) {
    const page = data.query.pages[pageId];
    console.log(page);
    if (page.thumbnail) {
      imageUrl = page.thumbnail.source;
      return imageUrl;
      break; // Stop iterating once a thumbnail is found
    }
  }

  return "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png";
}

function convertToSnakeCase(name: string): string {
  return name.replace(/\s+/g, "_");
}

const query =
  "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pithumbsize=600&format=json&origin=*&titles=";

async function getImageURL(title: string) {
  try {
    const response = await fetch(query + convertToSnakeCase(title), {
      method: "GET",
    });
    const apiRes = await response.json();
    const wikiResponse: WikiResponse = apiRes as WikiResponse;
    return getImageUrlFromResponse(wikiResponse);
  } catch (exc) {
    console.error("Error:", exc);
    console.warn("Partial URL:", title);
    return "";
  }
}

async function convertMapToGraph(
  mapData: MapItem[],
  startPage: string,
  endPage: string
) {
  // Keep track of unique nodes and their IDs
  const nodeIdMap: stringToIntMap = {};
  let nextNodeId = 1;

  // Define the graph object
  const graph: {
    nodes: {
      id: number;
      label: string;
      title: string;
      shape: string;
      image: string;
      size: number;
      font: string;
      level: number;
    }[];
    edges: { from: number; to: number }[];
  } = {
    nodes: [],
    edges: [],
  };

  // Loop through each item in the mapData
  for (const item of mapData) {
    const itemKey = Object.keys(item)[0];
    const values = item[itemKey];

    const makeNode = async (title: string) => {
      nodeIdMap[title] = nextNodeId++;
      const imageLink: string = await getImageURL(title);
      graph.nodes.push({
        id: nodeIdMap[title],
        label: title,
        title: `"${title}" tooltip text`,
        shape: "circularImage",
        image: imageLink,
        size: 40,
        font: "12px arial black",
        level: 0,
      });
    };

    // Create a node for the key
    if (!nodeIdMap[itemKey]) {
      await makeNode(itemKey);
    }

    // // Create edges for each value pointing to the key
    for (const valueUrl of values) {
      if (!nodeIdMap[valueUrl]) {
        await makeNode(valueUrl);
      }
      graph.edges.push({ from: nodeIdMap[valueUrl], to: nodeIdMap[itemKey] });
    }
  }

  let queue: number[] = [];
  queue.push(nodeIdMap[startPage]);
  let newQueue: number[] = [];
  let depthMap = new Map<number, number>();

  let depth: number = 0;
  while (queue.length != 0 && queue[0] != nodeIdMap[endPage]) {
    while (queue.length != 0 && queue[0] != nodeIdMap[endPage]) {
      const currentId: number = queue[0];
      depthMap.set(currentId, depth);
      for (let edge of graph.edges) {
        if (edge.from == currentId) {
          newQueue.push(edge.to);
        }
      }
      queue.shift();
    }
    depth += 1;
    queue = newQueue;
  }
  depthMap.set(nodeIdMap[endPage], depth + 1);
  for (let node of graph.nodes) {
    node.level = depthMap.get(node.id) as number;
  }

  return graph;
}
const NetworkGraph: React.FC<Props> = ({
  mapData,
  startPage,
  targetPage,
  showGraph,
}) => {
  if (!showGraph) {
    return;
  }

  const [graph, setGraph] = useState<{ nodes: any[]; edges: any[] } | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      const graph = await convertMapToGraph(mapData, startPage, targetPage);
      setGraph(graph);
    };

    fetchData();
  }, []);

  const options = {
    autoResize: true,
    width: "100%",
    layout: {
      hierarchical: true,
      improvedLayout: true,
    },
    nodes: {
      widthConstraint: { minimum: 50 },
    },
    edges: {
      color: "red",
      length: 200,
      smooth: { enabled: true, type: "dynamic" },
    },
    physics: {
      barnesHut: {
        springConstant: 0,
        avoidOverlap: 0.2,
        centralGravity: 0.5,
      },
    },
  };
  const events = {
    select: function (event) {
      var { nodes, edges } = event;
      console.log(edges);
      console.log(nodes);
      if (nodes.length === 1) {
        const nodeId = nodes[0];
        if (graph) {
          const selectedNode = graph.nodes.find((node) => node.id === nodeId);
          if (selectedNode) {
            const title = selectedNode.label;
            window.open(`https://en.wikipedia.org/wiki/${title}`, "_blank"); // Navigasi ke halaman Wikipedia dalam tab baru
          }
        }
      }
    },
  };
  return (
    <div>
      {graph ? (
        <Graph
          graph={graph}
          options={options}
          events={events}
          style={{ height: "640px" }}
        />
      ) : (
        <p>Loading graph...</p>
      )}
    </div>
  );
};
export default NetworkGraph;
