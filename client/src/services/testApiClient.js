'use strict';
const fetch = require('node-fetch');
const { parseString } = require('xml2js');
// const {
//   createAuthorDict,
//   createNodesFromDict,
//   createLinksFromDict,
// } = require('./data_helpers');

const BASE_URL = 'http://export.arxiv.org/api/';

async function fetchRequest(queryPath) {
  const res = await fetch(queryPath);
  const text = await res.text();
  return parseResponse(text);
}

function queryPathBuilder(title = '', author = '') {
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

async function fetchGraphData(query) {
  const [articles, metadata] = await fetchRequest(query);
  if (articles) {
    const dict = createAuthorDict(articles);
    const nodes = createNodesFromDict(dict);
    const links = createLinksFromDict(dict);
    return [dict, { nodes, links }, metadata];
  }
  return false;
}

function createAuthorDict(articles) {
  let dict = {};
  articles.forEach((article) => {
    const aID = article.id[0].replace('http://arxiv.org/abs/', '');
    const collabs = article.author.map((auth) => auth.name).flat();
    collabs.forEach((author) => {
      if (dict[author]) {
        if (!dict[author].ids.includes(aID)) {
          dict[author].ids.push(aID);
          dict[author].articles.push(article);
          dict[author].collabs.push(
            ...collabs.filter(
              (au) => !dict[author].collabs.includes(au) && au !== author
            )
          );
        }
      } else {
        dict[author] = {
          collabs: [...collabs.filter((au) => au !== author)],
          ids: [aID],
          articles: [article],
          expanded: false,
        };
      }
    });
  });
  return dict;
}

function createNodesFromDict(dict) {
  const nodes = [];
  for (const author in dict) {
    nodes.push({
      id: author,
      weight: dict[author].collabs.length,
    });
  }
  return nodes;
}

function createLinksFromDict(dict) {
  const links = [];
  for (const author in dict) {
    const tempLinks = dict[author].collabs.map((co) => {
      return { source: author, target: co };
    });
    tempLinks.forEach((el) => {
      if (
        links.filter(
          (li) =>
            (li.source === el.source && li.target === el.target) ||
            (li.source === el.target && li.target === el.source)
        ).length === 0
      ) {
        links.push(el);
      }
    });
  }
  return links;
}

function updateAuthorDict(oldDict, newDict) {
  let dict = Object.assign({}, oldDict);
  for (const key in newDict) {
    if (!dict[key]) {
      dict[key] = newDict[key];
    } else {
      newDict[key].articles.forEach((ar) => {
        const aID = ar.id[0].replace('http://arxiv.org/abs/', '');
        if (!dict[key].ids.includes(aID)) {
          dict[key].ids.push(aID);
          dict[key].articles.push(ar);
        }
      });
      newDict[key].collabs.forEach((col) => {
        !dict[key].collabs.includes(col) && dict[key].collabs.push(col);
      });
    }
  }
  return dict;
}

// tests
(async () => {
  const firstQ = queryPathBuilder('', 'Dexter Kozen');
  const secondQ = queryPathBuilder('', 'Helle Hvid Hansen');
  // eslint-disable-next-line no-unused-vars
  const [firstDict, i, m] = await fetchGraphData(firstQ);
  // eslint-disable-next-line no-unused-vars
  const [secondDict, j, n] = await fetchGraphData(secondQ);
  const updatedDict = updateAuthorDict(firstDict, secondDict);
  console.log(updatedDict);
})();
