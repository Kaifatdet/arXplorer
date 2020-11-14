'use strict';

const { parseString } = require('xml2js');
const BASE_URL = 'http://export.arxiv.org/api/';

export function queryPathBuilder(
  title = '',
  author = '',
  journal = '',
  abstract = ''
) {
  let queryUrl = BASE_URL + 'query' + '?search_query=';
  if (title && author) {
    queryUrl += `ti:%22${title.replace(/\s/g, '+')}%22`;
    queryUrl += '+AND+';
    queryUrl += `au:%22${author.replace(/\s/g, '+')}%22`;
  } else if (title) {
    queryUrl += `ti:%22${title.replace(/\s/g, '+')}%22`;
  } else if (author) {
    queryUrl += `au:%22${author.replace(/\s/g, '+')}%22`;
  } else if (journal) {
    queryUrl += `jr:%22${journal.replace(/\s/g, '+')}%22`;
  } else if (abstract) {
    queryUrl += `abs:%22${abstract.replace(/\s/g, '+')}%22`;
  } else {
    return false;
  }
  queryUrl += '&start=0&max_results=25';
  return queryUrl;
}

export function parseResponse(res) {
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
