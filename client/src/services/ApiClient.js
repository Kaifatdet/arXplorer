'use strict';
const fetch = require('node-fetch');
const { parseString } = require('xml2js');

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

function createNodes(articles) {
  let nodesSet = new Set();
  let nodes = [];
  articles.forEach((article) => {
    article.author.forEach((author) => {
      if (nodesSet.has(author.name[0]) === false) {
        nodes.push({ id: author.name[0] });
        nodesSet.add(author.name[0]);
      }
    });
  });
  return nodes;
}

function createLinks(articles) {
  let links = [];
  articles.forEach((article) => {
    if (linkAuthors(article.author) !== []) {
      links.push(linkAuthors(article.author));
    }
  });
  return links.flat();
}

function linkAuthors(authorArr) {
  let links = [];
  for (let i = 0; i < authorArr.length - 1; i++) {
    for (let j = i + 1; j <= authorArr.length - 1; j++) {
      links.push({
        source: authorArr[i].name[0],
        target: authorArr[j].name[0],
      });
    }
  }
  return links;
}

export async function fetchGraphData(query) {
  const [articles, metadata] = await fetchRequest(query);
  if (articles) {
    const nodes = createNodes(articles);
    const links = createLinks(articles);
    const fetched = { nodes: nodes, links: links };
    console.log('fetched', fetched);
    console.log('metadata', metadata);
    return fetched;
  }
  return false;
}
