import fetch from 'node-fetch';
import { Article, ArxivMetadata, Dictionary, GraphData } from '../types';

import { parseResponse } from './apiHelpers';
import {
  createAuthorDict,
  createNodesFromDict,
  createLinksFromDict,
  updateAuthorDict,
  addNewArticles,
} from './dataHelpers';

async function fetchRequest(
  queryPath: string
): Promise<[Article[], ArxivMetadata]> {
  if (localStorage.getItem(queryPath)) {
    return JSON.parse(localStorage.getItem(queryPath) || '');
  }
  const res = await fetch(queryPath);
  const text = await res.text();
  const parsed = parseResponse(text);
  localStorage.setItem(queryPath, JSON.stringify(parsed));
  return parsed;
}

export async function fetchGraphData(
  query: string,
  filters = {}
): Promise<[Dictionary, GraphData, ArxivMetadata, Article[]] | []> {
  const [articles, metadata] = await fetchRequest(query);
  if (articles) {
    const dict = createAuthorDict(articles, filters);
    const nodes = createNodesFromDict(dict);
    const links = createLinksFromDict(dict);
    return [dict, { nodes, links }, metadata, articles];
  }
  return [];
}

export async function updateAuthorData(
  oldDict: Dictionary,
  newDict: Dictionary
): Promise<[Dictionary, GraphData]> {
  const dict = updateAuthorDict(oldDict, newDict);
  const nodes = createNodesFromDict(dict);
  const links = createLinksFromDict(dict);
  return [dict, { nodes, links }];
}

export function updateArticlesList(
  oldList: Article[],
  newList: Article[]
): Article[] {
  return addNewArticles(oldList, newList);
}

export function removeAuthorFromGraph(
  graphData: GraphData,
  author: string
): GraphData {
  const nodes = [...graphData.nodes].filter((node) => node.id !== author);
  const links = [...graphData.links].filter(
    (link) => link.source !== author && link.target !== author
  );
  return { nodes, links };
}

export function shrinkGraph(oldDict: Dictionary): [Dictionary, GraphData] {
  const dict = oldDict;
  const nodes = createNodesFromDict(dict);
  const links = createLinksFromDict(dict);
  return [dict, { nodes, links }];
}
