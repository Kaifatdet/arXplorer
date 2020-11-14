'use strict';
const fetch = require('node-fetch');

const {
  createAuthorDict,
  createNodesFromDict,
  createLinksFromDict,
  updateAuthorDict,
  addNewArticles,
} = require('./dataHelpers');

const { parseResponse } = require('./apiHelpers');

async function fetchRequest(queryPath) {
  if (localStorage.getItem(queryPath))
    return JSON.parse(localStorage.getItem(queryPath));
  const res = await fetch(queryPath);
  const text = await res.text();
  const parsed = parseResponse(text);
  localStorage.setItem(queryPath, JSON.stringify(parsed));
  return parsed;
}

export async function fetchGraphData(query) {
  const [articles, metadata] = await fetchRequest(query);
  if (articles) {
    const dict = createAuthorDict(articles);
    const nodes = createNodesFromDict(dict);
    const links = createLinksFromDict(dict);
    return [dict, { nodes, links }, metadata, articles];
  }
  return false;
}

export async function updateAuthorData(oldDict, newDict) {
  const dict = updateAuthorDict(oldDict, newDict);
  const nodes = createNodesFromDict(dict);
  const links = createLinksFromDict(dict);
  return [dict, { nodes, links }];
}

export async function updateArticlesList(oldList, newList) {
  return addNewArticles(oldList, newList);
}

export function removeAuthorFromGraph(graphData, author) {
  const nodes = [...graphData.nodes].filter((node) => node.id !== author);
  const links = [...graphData.links].filter(
    (link) => link.source !== author && link.target !== author
  );
  return { nodes, links };
}
