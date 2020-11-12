'use strict';
const fetch = require('node-fetch');
const { parseString } = require('xml2js');
const {
  createAuthorDict,
  createNodesFromDict,
  createLinksFromDict,
} = require('./data_helpers');

const BASE_URL = 'http://export.arxiv.org/api/';

async function fetchRequest(queryPath) {
  const res = await fetch(queryPath);
  const text = await res.text();
  return parseResponse(text);
}

export function queryPathBuilder(title = '', author = '') {
  let queryUrl = BASE_URL + 'query' + '?search_query=';
  if (title && author) {
    queryUrl += `ti:%22${title.replace(/\s/g, '+')}%22`;
    queryUrl += '+AND+';
    queryUrl += `au:%22${author.replace(/\s/g, '+')}%22`;
  } else if (title) {
    queryUrl += `ti:%22${title.replace(/\s/g, '+')}%22`;
  } else if (author) {
    queryUrl += `au:%22${author.replace(/\s/g, '+')}%22`;
  } else {
    return false;
  }
  queryUrl += '&start=0&max_results=25';
  return queryUrl;
}

function parseResponse(res) {
  let metadata = {};
  let articles;
  parseString(res, function (err, result) {
    if (err) throw err;
    Object.assign(metadata, result.feed);
    delete metadata.entry;
    articles = result.feed.entry;
  });
  return [articles, metadata];
}

export async function fetchGraphData(query) {
  const [articles, metadata] = await fetchRequest(query);
  if (articles) {
    const dict = createAuthorDict(articles);
    const nodes = createNodesFromDict(dict);
    const links = createLinksFromDict(dict);
    return [dict, { nodes, links }, metadata];
  }
  return false;
}
