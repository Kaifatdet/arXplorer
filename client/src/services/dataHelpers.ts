import { Html5Entities } from 'html-entities';
import { categoriesDict } from './categories';
import {
  Article,
  ArxivCategory,
  ArxivNode,
  CategoryReference,
  Dictionary,
  GraphLink,
  GraphNode,
  QueryFilter,
} from '../types';

const htmlEntities = new Html5Entities();

export function createAuthorDict(
  articles: Article[],
  filters: QueryFilter = {}
): Dictionary {
  const dict: Dictionary = {};
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

export function createNodesFromDict(dict: Dictionary): GraphNode[] {
  const nodes: GraphNode[] = [];
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

export function createLinksFromDict(dict: Dictionary): GraphLink[] {
  const links: GraphLink[] = [];
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

function linkExists(arrOne: GraphLink, arrTwo: GraphLink): boolean {
  return (
    (arrOne.source === arrTwo.source && arrOne.target === arrTwo.target) ||
    (arrOne.source === arrTwo.target && arrOne.target === arrTwo.source)
  );
}

export function updateAuthorDict(oldDict: Dictionary, newDict: Dictionary) {
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

export function addNewArticles(prev: Article[], newList: Article[]): Article[] {
  const toAdd: Article[] = [];
  newList.forEach((ar) => {
    prev.filter((old) => old.id[0] === ar.id[0]).length === 0 && toAdd.push(ar);
  });
  return [...prev, ...toAdd];
}

export const sortArticleList = (
  arr: Article[],
  order = 'newest'
): Article[] => {
  return order === 'newest'
    ? [...arr].sort(
        (a, b) => +new Date(b.published[0]) - +new Date(a.published[0])
      )
    : [...arr].sort(
        (a, b) => +new Date(a.published[0]) - +new Date(b.published[0])
      );
};

export const getArticleId = (article: Article): string =>
  article.id[0].replace('http://arxiv.org/abs/', '');

export const parseGreekLetters = (str: string): string => {
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

function getValidCategoriesFromArticle(article: Article): string[] {
  return article.category
    .flatMap(
      (cat: ArxivNode<ArxivCategory>) =>
        categoriesDict[cat?.$?.term || ''] && cat?.$?.term
    )
    .filter((cat: any) => cat !== undefined) as string[];
}

function setCategoryProperties(
  dict: Dictionary,
  key: string,
  categoriesArray: string[]
): void {
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

function calculateGroupsFromCategories(dict: Dictionary): CategoryReference {
  let cats: CategoryReference = {};
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

function filterArticleByDate(article: Article, filters: QueryFilter): boolean {
  if (!filters['date-from'] || !filters['date-to']) return true;
  const articleDate = new Date(article.published[0]);
  const dateFrom = new Date(filters['date-from']);
  const dateTo = new Date(filters['date-to']);
  return +articleDate > +dateFrom && +articleDate < +dateTo;
}

function filterArticleBySubject(article: Article, filters: any): boolean {
  const subjects = Object.keys(filters).filter(
    (cat: any) => filters[cat] === true
  );
  if (subjects.length === 0) return true;
  return (
    article.category.filter((arCat) => {
      const i = arCat?.$?.term.indexOf('.');
      return subjects.includes(arCat?.$?.term.slice(0, i) as string);
    }).length > 0
  );
}