const { categoriesDict } = require('./categories');
const { Html5Entities } = require('html-entities');
const htmlEntities = new Html5Entities();

export function createAuthorDict(articles, filters = {}) {
  let dict = {};
  articles.forEach((article) => {
    if (
      filterArticleByDate(article, filters) &&
      filterArticleBySubject(article, filters)
    ) {
      const aID = getArticleId(article);
      const collabs = article.author.map((auth) => auth.name).flat();
      const categories = getValidCategoriesFromArticle(article);

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
            setCategoryProperties(dict, author, categories);
          }
        } else {
          dict[author] = {
            collabs: [...collabs.filter((au) => au !== author)],
            ids: [aID],
            articles: [article],
            expanded: false,
            main_cat: categories[0],
            categories: {},
          };
          categories.forEach((cat) => (dict[author].categories[cat] = 1));
        }
      });
    }
  });
  return dict;
}

function filterArticleByDate(article, filters) {
  if (!filters['date-from'] || !filters['date-to']) return true;
  const articleDate = new Date(article.published);
  return articleDate > filters['date-from'] && articleDate < filters['date-to'];
}

function filterArticleBySubject(article, filters) {
  const subjects = Object.keys(filters).filter((cat) => filters[cat] === true);
  if (subjects.length === 0) return true;
  return (
    article.category.filter((arCat) => {
      const i = arCat.$.term.indexOf('.');
      return subjects.includes(arCat.$.term.slice(0, i));
    }).length > 0
  );
}

export function createNodesFromDict(dict) {
  const nodes = [];
  const colorDict = calculateGroupsFromCategories(dict);
  for (const author in dict) {
    const main_cat = dict[author].main_cat;
    nodes.push({
      id: author,
      weight: dict[author].collabs.length,
      group: colorDict[main_cat],
      cat: main_cat,
      cat_name: categoriesDict[main_cat],
    });
  }
  return nodes;
}

export function createLinksFromDict(dict) {
  const links = [];
  for (const author in dict) {
    dict[author].collabs
      .map((co) => ({
        source: author,
        target: co,
      }))
      .forEach((el) => {
        if (links.filter((li) => linkExists(li, el)).length === 0) {
          links.push(el);
        }
      });
  }
  return links;
}

function linkExists(arrOne, arrTwo) {
  return (
    (arrOne.source === arrTwo.source && arrOne.target === arrTwo.target) ||
    (arrOne.source === arrTwo.target && arrOne.target === arrTwo.source)
  );
}

export function updateAuthorDict(oldDict, newDict) {
  let dict = Object.assign({}, oldDict);
  for (const key in newDict) {
    if (!dict[key]) {
      dict[key] = newDict[key];
    } else {
      newDict[key].articles.forEach((ar) => {
        const aID = getArticleId(ar);
        if (!dict[key].ids.includes(aID)) {
          dict[key].ids.push(aID);
          dict[key].articles.push(ar);

          const categories = getValidCategoriesFromArticle(ar);
          setCategoryProperties(dict, key, categories);
        }
      });
      newDict[key].collabs.forEach((col) => {
        !dict[key].collabs.includes(col) && dict[key].collabs.push(col);
      });
    }
  }
  return dict;
}

function getValidCategoriesFromArticle(array) {
  return array.category
    .map((cat) => {
      if (categoriesDict[cat.$.term]) return cat.$.term;
    })
    .flat()
    .filter((cat) => cat !== undefined);
}

function setCategoryProperties(dict, key, categoriesArray) {
  categoriesArray.forEach((cat) => {
    const main_cat = dict[key].main_cat;
    if (dict[key].categories[cat]) {
      dict[key].categories[cat]++;
      if (dict[key].categories[cat] > dict[key].categories[main_cat]) {
        dict[key].main_cat = cat;
      }
    } else {
      dict[key].categories[cat] = 1;
    }
  });
}

function calculateGroupsFromCategories(dict) {
  let cats = {};
  let counter = 1;
  for (const key in dict) {
    const cat = dict[key].main_cat;
    if (!cats[cat]) {
      cats[cat] = counter;
      counter++;
    }
  }
  return cats;
}

export function addNewArticles(prev, newList) {
  let toAdd = [];
  newList.forEach((ar) => {
    prev.filter((old) => old.id[0] === ar.id[0]).length === 0 && toAdd.push(ar);
  });
  return [...prev, ...toAdd];
}

export const sortArticleList = (arr, order = 'newest') => {
  return order === 'newest'
    ? [...arr].sort((a, b) => new Date(b.published) - new Date(a.published))
    : [...arr].sort((a, b) => new Date(a.published) - new Date(b.published));
};

export const getArticleId = (article) =>
  article.id[0].replace('http://arxiv.org/abs/', '');

export const parseGreekLetters = (str) => {
  const parsedStr = str
    .replace(/(\\emph)/g, '')
    .replace(/(\\mathsf)/g, '')
    .replace(/(\$\\)/g, '&')
    .replace(/\$/g, ';')
    .replace(/\{|\}/g, '')
    .replace(/(;*;)/g, '')
    .replace(/\^/g, '&sup');
  return htmlEntities.decode(parsedStr);
};

export function deleteAuthorsFromDict(dict, links, author) {
  const newDict = Object.assign({}, dict);
  const linksPointingFrom = links
    .filter((link) => link.target === author)
    .map((old) => old.source);
  const oldIds = newDict[author].ids;

  linksPointingFrom.forEach((ol) => {
    newDict[ol].articles = removeArticlesFromOldAuthor(newDict, oldIds, ol);
    // console.log('articles', newDict[ol].articles);
    newDict[ol].ids = removeIdsFromOldAuthor(newDict, oldIds, ol);
    // console.log('id', newDict[ol].ids);
    newDict[ol].collabs = removeCollabFromOldAuthor(newDict, ol, author);
    // console.log('collabs', removeCollabFromOldAuthor(newDict, ol, author));
    // console.log('collabs', newDict[ol].collabs);
  });

  newDict[author].collabs.forEach((au) => {
    !linksPointingFrom.includes(au) && delete newDict[au];
  });
  delete newDict[author];

  return newDict;
}

function removeArticlesFromOldAuthor(dict, articleIds, oldAuthor) {
  return dict[oldAuthor].articles
    .map((ar) => !articleIds.includes(getArticleId(ar)) && ar)
    .filter((el) => el !== false);
}

function removeIdsFromOldAuthor(dict, articleIds, oldAuthor) {
  return dict[oldAuthor].ids
    .map((id) => !articleIds.includes(id) && id)
    .filter((el) => el !== false);
}

function removeCollabFromOldAuthor(dict, old, authorToRemove) {
  return dict[old].collabs
    .map((co) => {
      console.log(co, authorToRemove);
      if (co !== authorToRemove) return co;
      // !co === authorToRemove && co;
    })
    .filter((el) => el !== false);
}

// function recursiveDeleting(author) {
//   if
// }
