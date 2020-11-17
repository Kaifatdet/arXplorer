/* eslint-disable no-unused-vars */
'use strict';

const { parseString } = require('xml2js');
const BASE_URL = 'https://export.arxiv.org/api/';

const queryPositions = { 0: 'ti', 1: 'au', 2: 'jr', 3: 'abs' };

export function queryPathBuilder(
  title = '',
  author = '',
  journal = '',
  abstract = '',
  filters = {}
) {
  let queryUrl = BASE_URL + 'query?search_query=';
  queryUrl += [...arguments]
    .slice(0, 4)
    .map(
      (arg, i) => arg && `${queryPositions[i]}:%22${arg.replace(/\s/g, '+')}%22`
    )
    .filter((a) => a !== '')
    .join('+AND+');
  queryUrl += '&start=0&max_results=25';
  return [queryUrl, filters];
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
